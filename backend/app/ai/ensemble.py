import os
import torch
from transformers import RobertaTokenizer, RobertaForSequenceClassification, AlbertTokenizer, AlbertForSequenceClassification
import joblib

import csv

mkb = {}
with open(os.path.join(os.path.dirname(__file__), './mkb.csv'), 'r', encoding='utf-8') as file:
    reader = csv.reader(file, delimiter='$')
    for row in reader:
        if len(row) == 2:
            mkb[row[0]] = row[1]

def get_true_label(text):
    return mkb.get(text, text)  

class CNNModel(torch.nn.Module):
    def __init__(self, input_dim, output_dim):
        super(CNNModel, self).__init__()
        self.dropout = torch.nn.Dropout(0.2)
        self.fc = torch.nn.Linear(input_dim, output_dim)
        
    def forward(self, x):
        x = self.dropout(x)
        return self.fc(x)

class EnsembleModel(torch.nn.Module):
    def __init__(self, bert_model_1, bert_model_2, cnn_model):
        super(EnsembleModel, self).__init__()
        self.bert_model_1 = bert_model_1
        self.bert_model_2 = bert_model_2
        self.cnn_model = cnn_model

    def forward(self, input_ids_1, attention_mask_1, input_ids_2, attention_mask_2):
        outputs_1 = self.bert_model_1(input_ids=input_ids_1, attention_mask=attention_mask_1).logits
        outputs_2 = self.bert_model_2(input_ids=input_ids_2, attention_mask=attention_mask_2).logits
        combined_outputs = torch.cat((outputs_1, outputs_2), dim=1)
        logits = self.cnn_model(combined_outputs)
        return logits

model_name_1 = os.path.join(os.path.dirname(__file__), 'RuBioRoBERTa')
model_name_2 = os.path.join(os.path.dirname(__file__), 'albert-base-v2')

tokenizer_1 = RobertaTokenizer.from_pretrained(model_name_1)
model_bert_1 = RobertaForSequenceClassification.from_pretrained(model_name_1, num_labels=250)

tokenizer_2 = AlbertTokenizer.from_pretrained(model_name_2)
model_bert_2 = AlbertForSequenceClassification.from_pretrained(model_name_2, num_labels=250)

cnn_model = CNNModel(input_dim=500, output_dim=250)
ensemble_model = EnsembleModel(model_bert_1, model_bert_2, cnn_model)

weights = os.path.join(os.path.dirname(__file__), 'ensemble')
ensemble_model.load_state_dict(torch.load(os.path.join(weights, './ensemble_model.pth'), map_location=torch.device('cpu')))

label_encoder = joblib.load(os.path.join(weights, './label_encoder.pkl'))


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
ensemble_model.to(device)


def get_ensemble_result(input_texts):
    ensemble_model.eval()
    with torch.no_grad():
        inputs1 = tokenizer_1((input_texts), return_tensors='pt', truncation=True, padding=True, max_length=512)
        inputs2 = tokenizer_2((input_texts), return_tensors='pt', truncation=True, padding=True, max_length=512)
        inputs1 = {k: v.to(device) for k, v in inputs1.items()}
        inputs2 = {k: v.to(device) for k, v in inputs2.items()}
        logits = ensemble_model(
            input_ids_1=inputs1['input_ids'],
            attention_mask_1=inputs1['attention_mask'],
            input_ids_2=inputs2['input_ids'],
            attention_mask_2=inputs2['attention_mask']
        )
        probabilities = torch.nn.functional.softmax(logits, dim=1)
        _, predicted_labels = torch.max(probabilities, dim=1)
        predicted_classes = label_encoder.inverse_transform(predicted_labels.cpu().numpy())
        return get_true_label(predicted_classes[0])

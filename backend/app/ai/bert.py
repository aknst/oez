import os
import joblib
import torch
from transformers import AutoTokenizer, RobertaForSequenceClassification

bert_weights = os.path.join(os.path.dirname(__file__), './bert')
tokenizer = AutoTokenizer.from_pretrained(bert_weights)

label_encoder = joblib.load(os.path.join(bert_weights, 'label_encoder_new.pkl'))
model = RobertaForSequenceClassification.from_pretrained(bert_weights)
model.eval()

def get_bert_result(text):
    text = text.lower()
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
  
    with torch.no_grad(): 
        outputs = model(**inputs)
        logits = outputs.logits 
    
    predicted_class = torch.argmax(logits, dim=1).item() 
    predicted_label = label_encoder.inverse_transform([predicted_class])  
    return predicted_label[0]

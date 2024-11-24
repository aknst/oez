## Описание

Наша команда решала задачу прогнозирования диагнозов на основе жалоб и анамнеза пациентов. Данная задача может сильно помочь экономить время и силы врачей при приемах и делать достаточно удобную базу данных для врачей, которая всегда находится под рукой. Наше решение позволяет с хорошей точностью предсказывать самые распространенные диагнозы из перечня МКБ для пациентов. Доступно две модели, обученные на разных датасетах: Bert - хорошая модель, позволяющая в момент получить отличные результаты; Ансамбль - также хорошая модель, однако для более хорошего её обучения необходимо накопить данных и дообучить её: идейно она работает как ансамбль двух различных моделей берт и слой CNN на выходе. Помимо этого был сгенерирован датасет рекомендаций, который достаточно сильно может помочь знающему врачу в четкой постановке лечения для пациента. В целом, наша реализация проекта может быть достаточно полезная почти в любой клинике.


## Использование

Краткая инструкция для запуска сайта:

0. Установить docker
1. Закинуть в /backend/app/ai модели, которые можно скачать по ссылке: https://drive.google.com/file/d/1yr93jncj7s1gezVJeZLtFW10eIipO10F/view?usp=sharing 
2. Выполнить docker compose up -d в папке с проектом
3. По ссылкам будут:
   - http://localhost:5173/ фронтенд
   - http://localhost:8000/docs бекенд

## Функциональные возможности

Перечень основных функций и возможностей нашего проекта: 
- Предсказание диагноза на основе жалоб и анамнеза болезни с помощью двух различных моделей с разным потенциалом; возможно переключение между моделями 
- Получение основных рекомендаций в соответствии с предсказанным диагнозом 
- Добавление новых пациентов, возможность сделать повторный прием 
- Отдельный список всех приемов с возможностью быстрого поиска по необходимому тексту 
- Возможность копировать диагноз предсказанный моделью либо вставлять уже поставленный диагноз одной кнопкой
- 


## Стек технологий: 
 
В нашем проекте использовались следующие технологии и инструменты:  
- Языки программирования: Python, JavaScript, TypeScript, HTML, CSS, Shell
- Библиотеки и фреймворки: numpy, pandas, torch, transformers (Roberta, Albert, RuBioRoBERTa, bert base), joblib, sklearn, ....
- Инструменты разработки: 

## Команда

Список участников команды: 
- Юрий Ч. : капитан команды, ответственный за всю ML часть
- Константин А. : ответственный за сайт: бэк + фронт
- Самандар У. : работа с бд, подготовка текста и презентации к защите
- Константин О. : помощь по бэкэнд части проекта 
- Роман М. : работа и подготовка датасетов, в том числе генерация для рекомендаций 

## Контакты

Список контактов: 
- Орлов Константин: @KIOrlov

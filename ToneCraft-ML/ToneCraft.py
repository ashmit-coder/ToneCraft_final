##Installing the Libraries

import PyPDF2
import boto3
import base64
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from io import BytesIO
import config
import os
import joblib


#Running the Fast Api
app = FastAPI()

class Text(BaseModel):
    content: str
    
##Calling the AWS config settings 

def get_settings():
    return config.Settings()

##Loading Emotion-Classification Model

pipe_lr = joblib.load(open("./emotion_classifier_pipe_lr.pkl", "rb"))


##Predicting Emotion

def predict_emotion(docx):
    results = pipe_lr.predict([docx])
    return results[0]


##Converting the PDF into text

def pdf_to_text(pdf_content):    
    temp_pdf_path = "temp_pdf.pdf"
    with open(temp_pdf_path, "wb") as temp_pdf_file:
        temp_pdf_file.write(pdf_content)
       
    pdf_reader = PyPDF2.PdfReader(temp_pdf_path)
    text = ''
    if pdf_reader.pages:
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    
    os.remove(temp_pdf_path)
    return text


##Applying the Basic SSML tags via AMAZON Polly

def applying_basic_polly(text, speaking_rate=1.2, volume='soft', pitch='medium', emphasis='none'):
    ssml_tags = f"<speak><amazon:effect name='drc'><prosody rate='{speaking_rate}' volume='{volume}' pitch='{pitch}'><emphasis level='{emphasis}'>{text}</emphasis></prosody></amazon:effect></speak>"
    return ssml_tags

def polly(text, emotion):
    if emotion == 'anger':
        text = applying_basic_polly(text, speaking_rate=1.3, volume='loud', emphasis='strong')
    elif emotion == 'disgust' or emotion == 'sad' or emotion == 'sadness' or emotion == 'shame':
        text = applying_basic_polly(text, speaking_rate=1.3, volume='soft', pitch='medium', emphasis='reduced')
    elif emotion == 'happy' or emotion == 'joy':
        text = applying_basic_polly(text, speaking_rate=1.3, volume='medium', emphasis='moderate')
    elif emotion == 'fear':
        text = applying_basic_polly(text, speaking_rate=1.3, volume='medium', pitch='medium', emphasis='strong')
    elif emotion == 'surprise':
        text = applying_basic_polly(text, speaking_rate=1.4, volume='medium', emphasis='moderate')
    elif emotion == 'neutral':
        text = applying_basic_polly(text, speaking_rate=1.2, volume='soft', pitch='medium', emphasis='none')
    return text


##Generating Audio files

def generate_audio(text, output_format="mp3"):
    emotion = predict_emotion(text)
    text = polly(text,emotion)
    
    client = boto3.client('polly', aws_access_key_id=get_settings().AWS_AK, aws_secret_access_key=get_settings().AWS_SAK, region_name='us-east-1')
    voice_id = 'Matthew'
    # text = polly(text, emotion='neutral')  
    results = client.synthesize_speech(Text=text, OutputFormat=output_format, VoiceId=voice_id, TextType='ssml')
    audio = results['AudioStream'].read()
    encoded_audio = base64.b64encode(audio).decode('utf-8')
    return encoded_audio


##Storing the chunks in a separate folder called Chunks

def create_audio_folder():
    # Create a unique folder for each execution
    folder_name = "audio_folder"
    folder_path = os.path.join(os.getcwd(), folder_name)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    return folder_path


##Making a clean audio function

def clean_audio_folder(folder_path):
    # Delete all files in the specified folder
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                os.rmdir(file_path)
        except Exception as e:
            print(f"Error: {e}")


##Using the FAST-API Interface

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        
        pdf_content = await file.read()        
        pdf_text = pdf_to_text(pdf_content)
        
        chunk_size = 400
        text_chunks = [pdf_text[i:i+chunk_size] for i in range(0, len(pdf_text), chunk_size)]
        
        ##Generate audio for each chunk and save to folder
        
        audio_folder = create_audio_folder()
        audio_files = []
        for i, chunk in enumerate(text_chunks):
            audio_data = generate_audio(chunk)
            
            ##Save each audio chunk to the folder
            audio_filename = os.path.join(audio_folder, f"audio_chunk_{i + 1}.mp3")
            audio_files.append(audio_filename)
            with open(audio_filename, "wb") as audio_file:
                audio_file.write(base64.b64decode(audio_data))        
       
        combined_audio = b""
        for audio_file in audio_files:
            with open(audio_file, "rb") as file:
                combined_audio += file.read()

        ##Return the combined audio using StreamingResponse
        
        response = StreamingResponse(iter([combined_audio]), media_type="audio/mpeg", headers={"Content-Disposition": "attachment;filename=combined_audiotw.mp3"})

        ##Cleaning the audio 
        clean_audio_folder(audio_folder)
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

##END
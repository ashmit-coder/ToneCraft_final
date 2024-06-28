import sys
import requests

api_url = "https://tonecraft-ml.onrender.com/upload_pdf/"
files = {'file': open(sys.argv[1], 'rb')}
# files = {'file': open(pdf_file_path, 'rb')}
response = requests.post(api_url, files=files)

if response.status_code == 200:
    with open(f"combined_audio.mp3", "wb") as file:
        file.write(response.content)
else:
    print(f"Request failed with status code: {response.status_code}")
    print(response.text)

sys.stdout.flush()
  
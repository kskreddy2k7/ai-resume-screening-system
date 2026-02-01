import re
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords")

def clean_text(text):
    # convert to lowercase
    text = text.lower()

    # remove numbers and symbols
    text = re.sub(r'[^a-z ]', '', text)

    # remove stopwords
    words = text.split()
    words = [w for w in words if w not in stopwords.words("english")]

    return " ".join(words)
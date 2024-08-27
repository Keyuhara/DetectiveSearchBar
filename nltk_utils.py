import numpy as np
import nltk
# nltk.download('punkt')
from nltk.stem.porter import PorterStemmer
stemmer = PorterStemmer()

# split sentence into array of words/tokens
def tokenize(sentence):
    return nltk.word_tokenize(sentence)

# find the root form of the word + ignore plurals/tenses
def stem(word):
    return stemmer.stem(word.lower())

# return bag of words array of 0 and 1
def bag_of_words(tokenized_sentence, words):
    # stem each word
    sentence_words = [stem(word) for word in tokenized_sentence]

    # initialize bag with 0 for each word
    bag = np.zeros(len(words), dtype=np.float32)
    for idx, w in enumerate(words):
        if w in sentence_words: 
            bag[idx] = 1

    return bag
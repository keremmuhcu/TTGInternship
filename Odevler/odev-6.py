import re

isim = "cemre MENGU"
if re.search("^[A-Z][a-z]+(?: [A-Z][a-z]+)? [A-Z][A-Z]+$", isim):#re.search("^[A-Z][a-z]+", liste[0]) != None and re.search("[^A-Z]",liste[1]) == None:
    print("Doğru")
else:
    print("Yanliş")
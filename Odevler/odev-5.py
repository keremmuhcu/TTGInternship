# parola kontrol
'''
En az bir büyük harf içermeli.
En az bir rakam içermeli.
Bir noktalama işareti veya matematiksel sembol içermeli.
"parola" kelimesi içermemeli.
Uzunluğu 7 karakterden fazla, 31 karakterden az olmali.
'''

import re

sifre = input("Sifre Giriniz: ")

if len(sifre) < 8 or len(sifre) > 30:
    print(f"Şifre 7 karakterden fazla ve 31 karakterden az olmali. Sizin şifrenizin uzunlugu: {len(sifre)}")
elif re.search("[A-Z]", sifre) != None and re.search("[0-9]", sifre) != None and re.search("[?!,.:+-/*%\"]",sifre) != None and re.search("parola",sifre.lower()) == None:
    print("Geçerli Şifre")
else: 
    print("Geçersiz Şifre")

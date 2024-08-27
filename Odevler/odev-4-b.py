# parola kontrol
'''
En az bir büyük harf içermeli.
En az bir rakam içermeli.
Bir noktalama işareti veya matematiksel sembol içermeli.
"parola" kelimesi içermemeli.
Uzunluğu 7 karakterden fazla, 31 karakterden az olmali.
'''

sifre = input("Sifre Giriniz: ")
gecerli_mi = {"Buyuk": False, "Rakam": False, "Isaret": False}
isaretler = ("?", "!", ".", "," ":", ";", "+" "-", "/", "*", "%", "\"")

if len(sifre) < 8 or len(sifre) > 30:
    print(f"Şifre 7 karakterden fazla ve 31 karakterden az olmali. Sizin şifrenizin uzunlugu: {len(sifre)}")
elif sifre.lower().find("parola") != -1:
    print("Şifrede \"parola\" kelimesi geçmemeli")
else:
    for i in sifre:
        if i.isupper():
            gecerli_mi.update({"Buyuk": True})
        elif i.isnumeric():
            gecerli_mi.update({"Rakam": True})
        else:
            for j in isaretler:
                if i == j:
                    gecerli_mi.update({"Isaret": True})
                    
    if gecerli_mi.get("Buyuk") and gecerli_mi.get("Rakam") and gecerli_mi.get("Isaret"):
        print("Sifre Gecerli")
    else:
        print("Sifre Gecersiz")
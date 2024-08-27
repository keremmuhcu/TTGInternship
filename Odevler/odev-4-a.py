# parola kontrol
'''
En az bir büyük harf içermeli.
En az bir rakam içermeli.
Bir noktalama işareti veya matematiksel sembol içermeli.
"parola" kelimesi içermemeli.
Uzunluğu 7 karakterden fazla, 31 karakterden az olmali.
'''

sifre = input("Sifre Giriniz: ")
                    
def buyuk_harf_kontrol(sifre): 
    for i in sifre:
        if i == i.upper():
            return True
        
    return False

def rakam_kontrol(sifre):
    for i in sifre:
        for j in range(0,9):
            if i == str(j):
                return True
    return False

def isaret_kontrol(sifre):
    isaretler = ("?", "!", ".", "," ":", ";", "+" "-", "/", "*", "%", "\"")
    for i in sifre:
        for j in isaretler:
            if i == j:
                return True
    return False

def parola_kelimesi_var_mi(sifre): 
    for i in range(0,len(sifre)):
        if (sifre[i].lower() == "p") and len(sifre) - i > 5:
            if sifre[i + 1].lower() == "a":
                if sifre[i + 2].lower() == "r" :
                    if sifre[i + 3].lower() == "o":
                        if sifre[i + 4].lower() == "l":
                            if sifre[i + 5].lower() == "a":
                                return True
    return False

if len(sifre) < 8 or len(sifre) > 30:
    print(f"Şifre 7 karakterden fazla ve 31 karakterden az olmali. Sizin şifrenizin uzunlugu: {len(sifre)}")
else:
    if(buyuk_harf_kontrol(sifre) and rakam_kontrol(sifre) and isaret_kontrol(sifre) and not parola_kelimesi_var_mi(sifre)):
        print("Şifre Geçerli")
    else:
        print("Geçersiz Şifre")




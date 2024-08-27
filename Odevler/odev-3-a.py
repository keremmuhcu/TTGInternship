# Faktöriyel Hesaplama
''' a. Bir sayinin faktöriyelini for döngüsü kullanarak hesaplayan bir program yazin.
Sonuçlari tek satirda, virgüllerle ayrilmiş şekilde yazdirin. '''
try:
    sayi = int(input("Sayi Giriniz: "))
    
    if sayi < 0:
        print("Geçersiz Giriş")
    elif sayi == 0:
        print("1")
    else:
        faktoriyel = 1
        sonuc = ""
        for i in range(1, (sayi + 1)):
            faktoriyel *= i
            
            sonuc += str(faktoriyel)
            if i != sayi:
                sonuc += ","
            
        print(sonuc)
except:
  print("Geçersiz Giriş")
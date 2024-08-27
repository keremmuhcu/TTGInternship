# b - recursive faktöriyel
hesaplanacak_sayi = 0

def faktoriyel_hesapla(sayi):
    if sayi == 1:
        print("1", end=", ")
        return 1
    else:
        faktoriyel = sayi * faktoriyel_hesapla(sayi - 1)
        if sayi == hesaplanacak_sayi:
            print(f'{faktoriyel}')
        else:
            print(f'{faktoriyel}', end= ", ")
        return faktoriyel
    
try:
    hesaplanacak_sayi = int(input("Sayi Giriniz: "))
    if hesaplanacak_sayi < 0:
        print("Negatif değer girmeyiniz.")
    elif hesaplanacak_sayi == 0:
        print("1")
    else:
        faktoriyel_hesapla(hesaplanacak_sayi)
except:
    print("Bir sayi giriniz.")    




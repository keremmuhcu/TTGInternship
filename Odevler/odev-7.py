#Tire Ekleme Programı:

'''Verilen string içindeki her iki tek sayi arasina tire ekleyen bir program yazin. 
Örneğin parametre 454793 ise çikti 4547-9-3 olmalidir.'''

sayi = "613549562" 
yazdir = ""
for i in range(0,len(sayi)):
    yazdir += sayi[i]
    if int(sayi[i]) % 2 != 0 and i != len(sayi) - 1:
        if int(sayi[i + 1]) % 2 != 0:
            yazdir += "-"
            
print(yazdir)
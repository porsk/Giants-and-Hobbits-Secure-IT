#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#define NEW_UID {0xDE, 0xAD, 0xBE, 0xEF}

#define RST_PIN   9 
#define SS_PIN    10

MFRC522 mfrc522(SS_PIN, RST_PIN);

LiquidCrystal_I2C lcd(0x3F, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);
MFRC522::MIFARE_Key key;
void setup() {
  Serial.begin(9600);
  while (!Serial);
  SPI.begin(); 
  mfrc522.PCD_Init();
  Serial.println(F("Warning: this example overwrites the UID of your UID changeable card, use with care!"));
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }  
}

void print_card_value(){
  Serial.print(F("Card UID:"));
  lcd.begin(20,4);
  lcd.setCursor(7,0);
  lcd.print("Hello");
  lcd.setCursor(3,1);
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    lcd.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    lcd.print(mfrc522.uid.uidByte[i], HEX);
  } 
  Serial.println();
}

void loop() {
  if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial() ) {
    delay(50);
    return;
  }
  if (! mfrc522.PICC_IsNewCardPresent() && mfrc522.uid.size != 0)
  {      
    print_card_value();
  }  
  delay(2000);
}

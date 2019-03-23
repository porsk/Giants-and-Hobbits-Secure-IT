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

String showmessage = "";
String hello = "";
String card_number = "";
bool sent = false;
bool okUser = true;
int ledPin = 8;
int buzzPin = 6;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzPin, OUTPUT);
  while (!Serial);
  SPI.begin(); 
  mfrc522.PCD_Init();
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }  
}

String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}

void print_card_value(){
  lcd.begin(20,4);

  lcd.setCursor(7,0);
  lcd.print(hello);
  lcd.setCursor(5,1);
  lcd.print(showmessage);
  
  char readFromServer[32];
  if(Serial.available()>0){
    Serial.readBytes(readFromServer,32);
    String fromServer = String(readFromServer); 
    if(getValue(fromServer, '|', 0).equals("showmessage")){       
        hello = "Hello"; 
        showmessage = getValue(fromServer, '|', 1);
        showmessage += "!";        
        okUser = true;
      }
      if((getValue(fromServer, '|', 0).equals("card")) && (getValue(fromServer, '|', 1).equals("wrong"))){
        for(int i=0; i<3; i++){
          digitalWrite(ledPin, HIGH);
          delay(500);
          digitalWrite(ledPin, LOW);
          delay(500);    
        }          
      }
      fromServer = "";
  }
    
}

void send_to_server(){
  String string = "card|";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    card_number += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    card_number += String(mfrc522.uid.uidByte[i], HEX);
  }
  string += card_number + "|in";
  char copy[string.length()+1];
  string.toCharArray(copy, string.length()+1);
  Serial.write(copy);
  Serial.println();
}

void buzz(){
  if(okUser){
    for(int i=0; i<5; i++){
      analogWrite(buzzPin, 100);
      delay(500);
      analogWrite(buzzPin, 0);
      delay(500);    
    }

    for(int i=0; i<6; i++){
      analogWrite(buzzPin, 100);
      delay(250);
      analogWrite(buzzPin, 0);
      delay(250);    
    }

    for(int i=0; i<8; i++){
      analogWrite(buzzPin, 100);
      delay(125);
      analogWrite(buzzPin, 0);
      delay(125);    
    }

    analogWrite(buzzPin, 100);
      delay(1000);
    analogWrite(buzzPin, 0);
  }
}

void communicate_with_slave(){
  
}

void loop() { 
  
  if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial() ) {
    lcd.clear();
    if(!card_number.equals("")){
      String string = "card|";
      string += card_number + "|out";
      char copy[string.length()+1];
      string.toCharArray(copy, string.length()+1);
      Serial.write(copy);
      Serial.println();
      card_number = "";
      sent = false;
      buzz();
    } 
    return;
  }
  if (! mfrc522.PICC_IsNewCardPresent() && mfrc522.uid.size != 0)
  {      
    if(!sent)
    {
      send_to_server();
      sent = true;
    }
    print_card_value();
  }  
  communicate_with_slave();
  delay(50);
}

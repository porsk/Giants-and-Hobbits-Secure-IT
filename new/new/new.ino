#include <Servo.h> 

int DoorLockPin = 3;
int LightValuePin = A3;
int FlameValuePin = A0;
int GasValuePin = A1;
int trigPin0 = 9;
int trigPin1 = 4;
int echoPin0 = 8;
int echoPin1 = 7;
int VecLed[4] {11,10,6,5};
bool AtHome = false;
bool AntiThief = true;
bool PhotoReg = true;

Servo DoorLock; 

void setup() {
  Serial.begin(9600);  
  DoorLock.attach(DoorLockPin);
  pinMode(trigPin0, OUTPUT);
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin0, INPUT);
  pinMode(echoPin1, INPUT);
  for(int i=0;i<=3;i++){
    pinMode(VecLed[i],OUTPUT);
  }
  DoorLock.write(180);
}
void DoorUnlocking(){
  DoorLock.write(0);
  delay(1000);
}

void DoorLocking(){
  DoorLock.write(180);
  delay(1000);
}

int ReadPushLightValue(){
  int LightValue{0};
  LightValue=analogRead(LightValuePin);
  return LightValue;
}

void ReadPushFlameValue(){
  int FlameValue{0};
  FlameValue=analogRead(FlameValuePin);
  if(FlameValue<=100){
    Serial.write("alert|flame");
    Serial.println();
  }
  delay(20);
}

void ReadPushGasValue(){
  int GasValue{0};
  GasValue=analogRead(GasValuePin);
  if(GasValue>=65) {
    Serial.write("alert|methane");
    Serial.println();
  }
  delay(20);
}

void ReadPushPresenceValue0(){
  digitalWrite(trigPin0, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin0, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin0, LOW);
  float DurationValue {0};
  DurationValue = pulseIn(echoPin0, HIGH);
  float DistanceValue {};
  DistanceValue= DurationValue*0.034/2;
  if(DistanceValue<=9){
    Serial.write("alert|motion|1");
    Serial.println();
  }
  delay(100);
}

void ReadPushPresenceValue1(){
  digitalWrite(trigPin1, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin1, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin1, LOW);
  float DurationValue {0};
  DurationValue = pulseIn(echoPin1, HIGH);
  float DistanceValue {};
  DistanceValue= DurationValue*0.034/2;
  if(DistanceValue<=9){
    Serial.write("alert|motion|2");
    Serial.println();
  }
  delay(100);
}

void AutomateLight(){
  int LightLevel{0};
  LightLevel = ReadPushLightValue();
  //Serial.println(LightLevel);
  int LightWork{0};
  if(LightLevel>=350){
    LightWork = map(LightLevel,350,700,0,250);
    for(int i=0;i<=3;i++){
    analogWrite(VecLed[i],LightWork);
    }
  }
  else {
    for(int i=0;i<=3;i++){
    analogWrite(VecLed[i],LOW);
    }
  }
  delay(100);
}

void AtHomeSimulation(){
  for(int i=0;i<=3;i++){
    digitalWrite(VecLed[i],LOW);
  }
  if (ReadPushLightValue()>350){
  int RandomValue{0};
  RandomValue=random(0,20);
  if(RandomValue<=3){
    digitalWrite(VecLed[RandomValue],HIGH);
  }
  }
  delay(20);
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

void loop() {
  ReadPushFlameValue();
  ReadPushGasValue();
  
  if(Serial.available()>0){
    char Command[32];
    Serial.readBytes(Command,32);
    String CommandStr = String(Command);
    if(getValue(CommandStr,'|',0).equals("door")){
      if(getValue(CommandStr,'|',1).equals("open")){ 
      DoorUnlocking();
      AtHome = true;
      }
      if(getValue(CommandStr,'|',1).equals("close")){
        DoorLocking();
        AtHome = false;
      }
    }
    else if(getValue(CommandStr,'|',0).equals("light")){
      if(getValue(CommandStr,'|',1).equals("thief")){
        if(getValue(CommandStr,'|',2).equals("on")){
          AntiThief = true;
        }
        if(getValue(CommandStr,'|',2).equals("off")){
          AntiThief = false; 
      }
    }
      if(getValue(CommandStr,'|',1).equals("evning")){
       if(getValue(CommandStr,'|',2).equals("on")){
           PhotoReg = true;
        }
        if(getValue(CommandStr,'|',2).equals("off")){
          PhotoReg = false; 
      }
    }
  }
 }

  if(AtHome && PhotoReg){
    AutomateLight();
  }
  if(!AtHome && AntiThief){ 
    AtHomeSimulation();
    ReadPushPresenceValue0();
    ReadPushPresenceValue1();
    }
   if(!AtHome && !AntiThief){
    ReadPushPresenceValue0();
    ReadPushPresenceValue1();
   }
}

#include <LiquidCrystal.h>
#include "HX711.h"
#define DOUT  3
#define CLK  2
 
HX711 scale(DOUT, CLK);

// defines pins numbers for  ultrasonic sensor
const int ledPin =  13;      // the number of the LED pin
const int trigPin = 9;
const int echoPin = 10;
const int buttonPin = 22;     // the number of the pushbutton pin
const int rs = 12, en = 11, d4 = 7, d5 = 6, d6 = 5, d7 = 4;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
int buttonState = 0;         // variable for reading the pushbutton status

// defines variables
int i = 0;
int j = 0;
int ultrasonic_sensor();
float loadcell_sensor();
int serial_data();
long duration;
int distance;
int U_Value;       //variable for storing ultrasonic sensor value from ultrasonic_sensor() function
float load;
float calibration_factor = -106600; 

void setup() {
  pinMode(ledPin, OUTPUT);         // initialize the LED pin as an output:
  pinMode(trigPin, OUTPUT);        // Sets the trigPin as an Output
  pinMode(echoPin, INPUT);        // Sets the echoPin as an Input
  Serial.begin(9600);            // Starts the serial communication
  scale.set_scale();
  //scale.tare(); //Reset the scale to 0
  //scale.tare(); 
  lcd.begin(16, 2);                // set up the LCD's number of columns and rows: 
  pinMode(buttonPin, INPUT);      // initialize the pushbutton pin as an input:
  Serial1.begin(115200);        // the Serial1 baud rate   
}

void loop() 
{
  scale.set_scale(calibration_factor); //Adjust to this calibration factor
  serial_data(); 
  if(Serial.available())
  {
    char Lvalue = Serial.read();
    if(Lvalue == 't' || Lvalue == 'T')
    scale.tare();                             //Reset the scale to zero      
  }
  int count;
  for(count=0;count<300;++count){
    buttonState = digitalRead(buttonPin);
    if(buttonState == 1)
      {
       sendMsg();
      // Serial.print("Door Open");
      }
    else
      {
        // Serial.print("Door Close");
        buttonState = digitalRead(buttonPin);
        digitalWrite(ledPin, LOW);
        i=0; 
        j=0;
        lcd.clear();
        U_Value=ultrasonic_sensor();
        float lValue = scale.get_units();
        load = lValue-0.80;
        if(U_Value<6 && load>15){
          alert();
          }
         lcd.setCursor(0,0);
         lcd.print("Distance : ");
         lcd.print(U_Value);
         lcd.setCursor(13,0);
         lcd.print("cm");
         lcd.setCursor(0,1);
         lcd.print("Load : ");
         lcd.print(load);
         lcd.setCursor(12,1);
         lcd.print("Kg"); 
     }
     delay(1000);
  }
 }

int ultrasonic_sensor()
{
   digitalWrite(trigPin, LOW);            // Clears the trigPin
   delayMicroseconds(2);
   digitalWrite(trigPin, HIGH);         // Sets the trigPin on HIGH state for 10 micro seconds
   delayMicroseconds(10);
   digitalWrite(trigPin, LOW);

   duration = pulseIn(echoPin, HIGH);   // Reads the echoPin, returns the sound wave travel time in microseconds

   distance= duration*0.034/2;         // Calculating the distance  
   return distance;
  
}
int serial_data()
{
  U_Value=ultrasonic_sensor();
  float lValue = scale.get_units();
  load = lValue-0.80;
//Sendind Data to the Srrial Monitor  
 // Serial.print("id");
   Serial.print("10");
  Serial.print("distance");
  //delay(2000);
  if(U_Value/100==0)
  {
    Serial.print("0");
    if(U_Value/10==0){
      Serial.print("0");
      }
    }
  Serial.print(U_Value);
  Serial.print("load");
  Serial.println(load);
  delay(1000);
  
}
void sendMsg()
{
 if(i==0)
    digitalWrite(ledPin, HIGH);
    Serial1.print("AT+CMGF=1\r");                     //sending SMS in text mode
    //Serial.println("AT+CMGF=1\r"); 
    delay(1000);
    Serial1.print("AT+CMGS=\"+918871002877\"\r");    // phone number
   // Serial.println("AT+CMGS=\"+918871002877\"\r"); 
    delay(1000);
    Serial1.print("Doop Open\r");                  // message
    //Serial.println("Doop Open\r"); 
    delay(1000);
    Serial1.write(0x1A);                          //send a Ctrl+Z(end of the message)
    delay(1000);
    //Serial.println("SMS sent successfully");
    i++;
}
void alert(){
   if(j==0)
    digitalWrite(ledPin, HIGH);
    Serial1.print("AT+CMGF=1\r");                     //sending SMS in text mode
    //Serial.println("AT+CMGF=1\r"); 
    delay(1000);
    Serial1.print("AT+CMGS=\"+918871002877\"\r");    // phone number
   // Serial.println("AT+CMGS=\"+918871002877\"\r"); 
    delay(1000);
    Serial1.print("Dustbin has filled 85%.. Please take action..\r");                  // message
    //Serial.println("Doop Open\r"); 
    delay(1000);
    Serial1.write(0x1A);                          //send a Ctrl+Z(end of the message)
    delay(1000);
    //Serial.println("SMS sent successfully");
    j++;
  }

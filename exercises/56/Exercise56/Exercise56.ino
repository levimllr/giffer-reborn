//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.  Giffer checks all aspects of this exercise.
// 2.   If Giffer says CORRECT it is good to go
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  Serial.begin(9600); // Open serial monitor at 9600 baud to see potentiometer values
  pinMode(18, INPUT); // If not specifically pulled LOW by Potentiometer, will be pulled HIGH
  pinMode(5, INPUT);      // sets the Analog pin 5 as input
  for (int ledNumber = 2; ledNumber <= 15; ledNumber++)
  {
    pinMode(ledNumber, OUTPUT);
  }
}

void loop()
{
  int pin18;
  int potentiometerValueA5;
  Serial.print("Hello World!");

  int i = 1;
  while (i <= 100)
  {
    pin18 = digitalRead(18);
    potentiometerValueA5 = analogRead(5); // read the input pin between 0 and 1023
    // Read the value of pin 18, the on/off switch to see if the board is on
    if (pin18 == 0) // Knob OFF - ONLY print “Knob turned OFF”
    {
      Serial.println("Knob turned OFF - turn Knob Clockwise to turn ON");
    }
    if (pin18 == 1) // Knob ON - Now read A5 and see which LEDs to turn on
    {
      // Light Up LED's corresponding to analog values.
      // divide 1024 into 4 areas

      // 000 - 255
      if ( potentiometerValueA5 >= 0 && potentiometerValueA5 <= 255 ) // IF the potentiometerValueA5 is between 0 and 255
      {
        // Send status to Serial Monitor
        Serial.print("Onboard POTENTIOMETER -  Pin A5 (0-1023): ");
        Serial.println(potentiometerValueA5); // Send the value read from Pin 5: 0 to 1023
        Serial.print("Blink LED 2 and 3");
        Serial.println("");
        digitalWrite(2, HIGH);
        digitalWrite(3, HIGH);
        delay(50);
        digitalWrite(2, LOW);
        digitalWrite(3, LOW);
        delay(50);
      }

      // 256 - 511
      if ( potentiometerValueA5 >= 256 && potentiometerValueA5 <= 511 ) // IF the potentiometerValueA5 is between 256 and 511
      {
        // Send status to Serial Monitor
        Serial.print("Onboard POTENTIOMETER -  Pin A5 (0-1023): ");
        Serial.println(potentiometerValueA5); // Send the value read from Pin 5: 0 to 1023
        Serial.print("Blink LED 7 and 8");
        Serial.println("");
        digitalWrite(7, HIGH);
        digitalWrite(8, HIGH);
        delay(50);
        digitalWrite(7, LOW);
        digitalWrite(8, LOW);
        delay(50);
      }

      // 512 - 763
      if ( potentiometerValueA5 >= 512 && potentiometerValueA5 <= 763 ) // IF the potentiometerValueA5 is between 512 and 763
      {
        // Send status to Serial Monitor
        Serial.print("Onboard POTENTIOMETER -  Pin A5 (0-1023): ");
        Serial.println(potentiometerValueA5); // Send the value read from Pin 5: 0 to 1023
        Serial.print("Blink LED 9 and 10");
        Serial.println("");
        digitalWrite(9, HIGH);
        digitalWrite(10, HIGH);
        delay(50);
        digitalWrite(9, LOW);
        digitalWrite(10, LOW);
        delay(50);
      }
      // 764 - 1023
      if ( potentiometerValueA5 >= 764 && potentiometerValueA5 <= 1023 ) // IF the potentiometerValueA5 is between 764 and 1023
      {
        // Send status to Serial Monitor
        Serial.print("Onboard POTENTIOMETER -  Pin 5 (0-1023): ");
        Serial.println(potentiometerValueA5); // Send the value read from Pin 5: 0 to 1023
        Serial.print("Blink LED 14 and 15");
        Serial.println("");
        digitalWrite(14, HIGH);
        digitalWrite(15, HIGH);
        delay(50);
        digitalWrite(14, LOW);
        digitalWrite(15, LOW);
        delay(50);
      }
    }
    i = i + 1;
    delay(10);
  }
  Serial.println("Good Bye World");
  delay(10);
}
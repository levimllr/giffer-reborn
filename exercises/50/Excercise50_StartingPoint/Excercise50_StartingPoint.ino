void setup()
{
  Serial.begin(9600); // Setup the serial port speed
  Serial.println("BEGIN - setup");

  int ledNumber;
  for(ledNumber = 2; ledNumber <= 15; ledNumber ++) // Enable Pins 2 - 15 to be outputs
  {
    Serial.print("pinMode("); // print a string of characters
    Serial.print(ledNumber); // print a variable
    Serial.println(", OUT_PUT);"); // finish printing the line
    pinMode(ledNumber, OUTPUT);
  }
  Serial.println("END - setup");
}


void loop()
{
  Serial.println("BEGIN - loop");
  int ledNumber;
  int count;

  for(count = 1; count <= 4; count++)
  {
    Serial.print("The value of count is: "); // print a string of characters
    Serial.print(count); // print the value of a variable
    Serial.println(""); // finish printing the line

    for(ledNumber = 2; ledNumber <= 8; ledNumber++) // blinks LED's 2 through 8 going up
    {
      digitalWrite(ledNumber, HIGH);
      delay(75);
      digitalWrite(ledNumber, LOW);
      Serial.print("The value of count is: "); // print a string of characters
      Serial.print(count); // print the value of a variable
      Serial.print("The value of ledNumber is: "); // print a string of characters
      Serial.print(ledNumber); // print the value of a variable
      Serial.println(""); // finish printing the line
    }

    for(ledNumber = 8; ledNumber >= 2; ledNumber++) // blinks LED's 8 through 2 going down
    {
      digitalWrite(ledNumber, HIGH);
      delay(75);
      digitalWrite(ledNumber, LOW);
    }
  }
  delay(4000);
  Serial.println("END - loop");
}
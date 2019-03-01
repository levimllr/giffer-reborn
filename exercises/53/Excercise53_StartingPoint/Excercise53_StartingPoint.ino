// Exercise56: Using Serial.print to trace your code
//
// 1. Compile and upload Exercise 30
// 2. Turn on the Serial Port Monitor - Tools - Serial Monitor
// 3. Observe what is printed out to the Serial Monitor
// 4. Insert code to have the Arduino send BEGIN - setup and start a new line at the end of setup.
// 5. use Serial.print to help you figure out what is wrong with the for loop that blinks LED's 8 through 2 going down


void setup()
{
  Serial.begin(9600); // Setup the serial port speed
  Serial.println("BEGIN - setup");

  int ledNumber;
  for(ledNumber = 2; ledNumber <= 15; ledNumber ++) // Enable Pins 2 - 15 to be outputs
  {
    Serial.print("The value of ledNumber is: "); // print a string of characters
    Serial.print(ledNumber); // print a variable
    Serial.println(); // finish printing the line
    pinMode(ledNumber, OUTPUT);
  }

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
    Serial.println(); // finish printing the line

    for(ledNumber = 2; ledNumber <= 8; ledNumber++) // blinks LED's 2 through 8 going up
    {
      digitalWrite(ledNumber, HIGH);
      delay(75);
      digitalWrite(ledNumber, LOW);
      Serial.print("The value of count is: "); // print a string of characters
      Serial.print(count); // print the value of a variable
      Serial.print("The value of ledNumber is: "); // print a string of characters
      Serial.print(ledNumber); // print the value of a variable
      Serial.println(); // finish printing the line
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

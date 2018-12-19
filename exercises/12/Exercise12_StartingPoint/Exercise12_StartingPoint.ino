void setup()
{
  int ledNumber; // creates an integer ledNumber
  ledNumber = 2; // sets the value stored in ledNumber
  while (ledNumber <= 15) // this while loop will repeat fourteen times
  { // Enables pin 2 – 15 on the Arduino to Send enough power to turn on a LED
    pinMode(ledNumber, OUTPUT);
    ledNumber = ledNumber + 1;
  }
}
void loop()
{
  int ledNumber; // creates an integer ledNumber
  ledNumber = 15; // sets the value stored in ledNumber
  while (ledNumber >= 2) // this while loop will repeat fourteen times
  { // this will turn on and off LED 15 through LED 2 with a 200ms delay between
    digitalWrite(ledNumber, HIGH);
    delay(200);
    digitalWrite(ledNumber, LOW);
    ledNumber = ledNumber - 1;     //  ledNumber gets the value of ledNumber – 1
  }
  delay(4000);
}

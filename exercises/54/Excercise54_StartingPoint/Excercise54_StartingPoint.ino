void setup()
{
  Serial.begin(9600); // Setup the serial port speed
pinMode(18, INPUT); // If not specifically pulled LOW by Potentiometer, will be pulled HIGH
  pinMode(5, INPUT);      // sets the Analog pin 5 as input

}

void loop()
{
  Serial.print("Hello World!");
  Serial.println("");
  int pin18 = 0;     // variable to store the read value
  int potentiometerValueA5;
//  pin18 = digitalRead(18); // read the input pin either HIGH or LOW
//  potentiometerValueA5 = analogRead(5); // read the input pin between 0 and 1023
  // Light Up LED's corresponding to analog values.
  // If we divide 1024 into 2 areas

  int i = 1;
while(i<=20000)
{
    if (pin18==0)
    {
        Serial.println("Pin 18 is equal to zero");
    }
    if (pin18==1)
    {
        Serial.println("Pin 18 is equal to one");
  }
  delay(1);
  i = i + 1;
}
  Serial.println("Good Bye World");
  delay(500);
}
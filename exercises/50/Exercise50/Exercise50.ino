//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1.	Giffer checks all aspects of this exercise.
// 2.   If Giffer says CORRECT it is good to go
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{
  Serial.begin(9600); // Setup the serial port speed
}

void loop()
{
  Serial.print("Hello World!");
  Serial.println("");
  delay(500);
  Serial.print("Good Bye World!!");
  Serial.println("");
  delay(5000);
}

//**************ACTIVITES TO CHECK WHILE GRADING**********BEGIN*********
//
//1.	Verify that there are two function definitions and function calls
//a.	 blinkTwoOnce() and blinkThreeOnce
//2.	Verify that LEDs blink in this order 2, 3
//3.	Should repeat 5 times and then pause for 4 seconds
//4.	Verify that parameters are used instead of typing out the numbers
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************

void setup()
{ 
  pinMode(9, OUTPUT);
  pinMode(15, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(14, OUTPUT);
}


void loop()
{ 
  int x;

  for(x = 1; x <= 5; x++)
  { 
    blinkTwoOnce(200);
  }

  delay(4000);
}


void blinkTwoOnce(int t)
{ 
  digitalWrite(9, HIGH);
  delay(t);
  digitalWrite(15, HIGH);
  delay(t);
  digitalWrite(10, HIGH);
  delay(t);
  digitalWrite(14, HIGH);
  delay(t);
}



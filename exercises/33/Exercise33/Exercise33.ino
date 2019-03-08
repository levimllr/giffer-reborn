//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
//1.	Verify that the LEDs blink in this order: 4, 2, 3
//2.	Verify that the parameters have been modified in the function calls to turn on LEDs 4, 2, 3
//3.	Should repeat 5 times and then pause for 4 seconds
//4.	Verify that parameters are used instead of typing out the numbers
//
// ***************ACTIVITIES TO CHECK WHILE GRADING END*********************
void setup()
{ 
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
}


void loop()
{ 
  int x;

  for(x = 1; x <= 5; x++)
  { 
    blinkOnce(100, 4);
    blinkOnce(100, 2);
    blinkOnce(100, 3);
  }

  delay(4000);
}


void blinkOnce(int t, int n)
{ 
  digitalWrite(n, HIGH);
  delay(t);
  digitalWrite(n, LOW);
  delay(t);
}


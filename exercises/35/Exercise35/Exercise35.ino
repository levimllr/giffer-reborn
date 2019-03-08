//**************ACTIVITIES TO CHECK WHILE GRADING**********BEGIN*********
//
// 1. Verify that there are only three function calls in loop()
// a)	sequenceLEDsFromRightToLeft(200, 2);
// b)	  sequenceLEDsFromLeftToRight(200, 4);
// c)	  sequenceLEDsFromRightToLeft(500, 1);
//
//**************ACTIVITIES TO CHECK WHILE GRADING**********END*********

void setup()
{ 
  int pinNumber;
  
  for(pinNumber = 2; pinNumber <= 15; pinNumber++)
  { 
    pinMode(pinNumber, OUTPUT);
  }
}

void loop()
{
  sequenceLEDsFromRightToLeft(200, 2);
  
  sequenceLEDsFromLeftToRight(200, 4);
  
  sequenceLEDsFromRightToLeft(500, 1); 
  
  delay(3000);
}

void sequenceLEDsFromRightToLeft(int onTime, int repeatCount)
{ 
  int count;
  int pinNumber;
  
  for(count = 1; count <= repeatCount; count++)
  {
    for(pinNumber = 2; pinNumber <= 15; pinNumber++)
    { 
      digitalWrite(pinNumber, HIGH);
      delay(onTime);
      digitalWrite(pinNumber, LOW);
    }
  }
}

void sequenceLEDsFromLeftToRight(int onTime, int repeatCount)
{ int count;
  int pinNumber;
  
  for(count = 1; count <= repeatCount; count++)
  {
    for(pinNumber = 15; pinNumber >= 2; pinNumber--)
    { 
      digitalWrite(pinNumber, HIGH);
      delay(onTime);
      digitalWrite(pinNumber, LOW);
    }
  }
}
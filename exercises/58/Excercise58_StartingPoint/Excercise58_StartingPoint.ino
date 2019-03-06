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

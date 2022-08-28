import { v4 } from 'uuid'
import { TextLengthValidator } from '../src/validators/textLengthValidator'
import { TextField } from '../src/models/forms/fields/implementations/textField'


describe('Test form text form field..', () => {
    
    test('the TextField isValid() method with a text length validator.', () => {

        let tf: TextField = new TextField(v4(), "Testing!", true, [new TextLengthValidator(3, 5)])
        expect(tf.isValid()).toBeFalsy()

        // Change the validator so that the string is valid
        tf.validators = [new TextLengthValidator(3, 20)]
        expect(tf.isValid()).toBeTruthy()

        // Change the validator so that maxLength isn't defined.
        tf.validators = [new TextLengthValidator(3, null)]
        expect(tf.isValid()).toBeTruthy()

        // Change it so that minLength isn't defined
        tf.validators = [new TextLengthValidator(null, 5)]
        expect(tf.isValid()).toBeFalsy()
    });
});
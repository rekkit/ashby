import { FIELD_TYPE } from "../models/forms/fields/fieldType";
import { BooleanField } from "../models/forms/fields/implementations/booleanField";
import { EmailField } from "../models/forms/fields/implementations/emailField";
import { FileField } from "../models/forms/fields/implementations/fileField";
import { SingleSelectDropdownField } from "../models/forms/fields/implementations/singleSelectDropdownField";
import { TextField } from "../models/forms/fields/implementations/textField";
import { ArrayContainsValueValidator } from "../validators/arrayContainsValueValidator";
import { ArraySizeValidator } from "../validators/arraySizeValidator";
import { EmailValidator } from "../validators/emailValidator";
import { TextContainsValidator } from "../validators/textContainsValidator";
import { TextLengthValidator } from "../validators/textLengthValidator";
import { Validator } from "../validators/validator";
import { VALIDATOR_TYPE } from "../validators/validatorType";

/**
 * The class that we use to deserialize fields and validators.
 */
// TODO: This needs more polish. We need to check to make sure that each of the arguments
// that we need exist in the JSON object. 
export class SerializationHelper {

    /**
     * Deserializes a JSON into a class that extends the Field class.
     * 
     * @param json. The JSON to deserialize.
     * @returns an instance of a class that extends the Field class.
     */
    public static deserializeField(json: any): any {

        if (json.fieldType === undefined) {
            throw new Error("Can not infer the field type.")
        }

        switch (json.fieldType) {
            case FIELD_TYPE.BOOLEAN:
                return new BooleanField(json.id, json.value, json.required)

            case FIELD_TYPE.EMAIL:
                return new EmailField(json.id, json.value, json.required)

            case FIELD_TYPE.FILE:
                return new FileField(
                    json.id, 
                    json.value, 
                    json.required, 
                    json.validator == undefined ? [] : [this.deserializeValidator(json.validator)!])

            case FIELD_TYPE.SINGLE_SELECT:
                return new SingleSelectDropdownField(json.id, json.value, json.required, json.possibleValues)

            case FIELD_TYPE.TEXT:
                return new TextField(
                    json.id, 
                    json.value, 
                    json.required, 
                    json.validator == undefined ? [] : [this.deserializeValidator(json.validator)!])

            default:
                throw new Error("Unknown field type.")
        }
    }

    /**
     * Deserializes a JSON into a validator class.
     * 
     * @param json. The JSON that represents a validator class.
     * @returns an instance of a class that extends the Validator class.
     */
    public static deserializeValidator(json: any | undefined): Validator<any> | null {

        if (json == undefined) return null

        if (json.validatorType === undefined) {
            throw new Error("Can not infer validator type.")
        }

        switch (json.validatorType) {
            case VALIDATOR_TYPE.TEXT_CONTAINS:
                return new TextContainsValidator(json.queryString)

            case VALIDATOR_TYPE.TEXT_LENGTH:
                return new TextLengthValidator(json.minLength, json.maxLength)

            case VALIDATOR_TYPE.ARRAY_CONTAINS:
                return new ArrayContainsValueValidator(json.allowedValues)

            case VALIDATOR_TYPE.ARRAY_SIZE:
                return new ArraySizeValidator(json.minLength, json.maxLength)

            case VALIDATOR_TYPE.EMAIL:
                return new EmailValidator()

            default:
                throw new Error("Unknown validator type.")
        }
    }
}
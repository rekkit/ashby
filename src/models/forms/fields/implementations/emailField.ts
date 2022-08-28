import { EmailValidator } from "../../../../validators/emailValidator";
import { Field } from "../abstract/field";
import { FIELD_TYPE } from "../fieldType";

/**
 * Represents an email field.
 */
export class EmailField extends Field<string> {

  /**
   * The constructor.
   * 
   * @param id. The ID of this form field.
   * @param value. The value of this form field. Can be any valid email.
   * @param required. The field that indicates whether value needs to be set or not.
   */
  constructor(id: string, value: string, required: boolean) {
    super(id, FIELD_TYPE.EMAIL, value, required, [new EmailValidator()])
  }
}

import { EmailValidator } from "../../../../validators/emailValidator";
import { Field } from "../abstract/field";
import { FIELD_TYPE } from "../fieldType";

/**
 * Represents an email field.
 */
export class EmailField extends Field<string, EmailField> {

  /**
   * The constructor.
   * 
   * @param id. The ID of this form field.
   * @param value. The value of this form field. Can be any valid email.
   * @param required. The field that indicates whether value needs to be set or not.
   */
  constructor(id: string, value: string | null, required: boolean) {
    super(id, FIELD_TYPE.EMAIL, value, required, [new EmailValidator()])
  }

  public duplicate(id: string): EmailField {
    return new EmailField(id, this.value, this.required)
  }
}

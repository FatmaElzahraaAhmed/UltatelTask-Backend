import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDateInRange(minAge: number, maxAge: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateInRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!(value instanceof Date)) {
            return false;
          }

          const now = new Date();
          const minDate = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
          const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());

          return value >= minDate && value <= maxDate;
        },
        defaultMessage(args: ValidationArguments) {
          const now = new Date();
          const minDate = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
          const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());

          return `Date of birth must be between ${minDate.toISOString().split('T')[0]} and ${maxDate.toISOString().split('T')[0]}`;
        },
      },
    });
  };
}

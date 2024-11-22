import type { FC } from 'hono/jsx';

export const Input: FC<{
  name: string;
  label: string;
  required?: boolean;
}> = (props: {
  name: string;
  label: string;
  required?: boolean;
}) => (
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label" for={`input-${props.name}`}>
        {props.label}
      </label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control">
          <input
            class="input"
            type="text"
            id={`input-${props.name}`}
            name={props.name}
            required={props.required || false}
          />
        </p>
      </div>
    </div>
  </div>
);

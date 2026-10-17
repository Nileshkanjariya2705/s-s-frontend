import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { uploadPlugin } from "../../helper/uploadAdapter";
import { useIntl } from "react-intl";

interface CkProps<TForm extends FieldValues> {
  label?: string;
  control: Control<TForm, any>;
  name: Path<TForm>;
  placeholder?: string;
  error?: any;
}

const CkEditor = <TForm extends Record<string, unknown>>({
  label,
  name,
  error,
  control,
}: CkProps<TForm>) => {
  const intl = useIntl();
  return (
    <>
      {label && (
        <label className="text-sm font-medium text-black mb-3 inline-block">
          {label} <span className="text-red-600">*</span>
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{
          required: "Please enter task description",
        }}
        render={({
          field,
        }: {
          field: ControllerRenderProps<TForm, Path<TForm>>;
        }) => {
          return (
            <>
              <div>
                {((typeof field.value === "string" && field.value.length > 0) ||
                  field) && (
                  <CKEditor
                    config={{
                      heading: {
                        options: [
                          {
                            model: "paragraph",
                            title: "Paragraph",
                            class: "ck-heading_paragraph",
                          },
                          {
                            model: "heading1",
                            view: "h1",
                            title: "Heading 1",
                            class: "ck-heading_heading1",
                          },
                          {
                            model: "heading2",
                            view: "h2",
                            title: "Heading 2",
                            class: "ck-heading_heading2",
                          },
                          {
                            model: "heading3",
                            view: "h3",
                            title: "Heading 3",
                            class: "ck-heading_heading3",
                          },
                          {
                            model: "heading4",
                            view: "h4",
                            title: "Heading 4",
                            class: "ck-heading_heading4",
                          },
                          {
                            model: "heading5",
                            view: "h5",
                            title: "Heading 5",
                            class: "ck-heading_heading5",
                          },
                          {
                            model: "heading6",
                            view: "h6",
                            title: "Heading 6",
                            class: "ck-heading_heading6",
                          },
                        ],
                      },
                      // @ts-ignore
                      extraPlugins: [uploadPlugin],
                    }}
                    editor={ClassicEditor}
                    onChange={(_e, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
                    }}
                    data={field.value as string}
                  />
                )}
              </div>
            </>
          );
        }}
      />

      {error[name] && (
        <span className="text-sm font-semibold text-red-500 block  mt-1">
          {intl.formatMessage({ id: error[name].message })}
        </span>
      )}
    </>
  );
};

export default CkEditor;

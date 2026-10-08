import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  getPageTemplate,
  getTemplateFormValues,
} from "@/lib/page-templates";

const fieldClass = "rounded-xl border border-forest/15 bg-white px-3 py-2";

export function PageTemplateFields({ slug, content }: { slug: string; content: string }) {
  const template = getPageTemplate(slug);
  if (!template) return null;
  const values = getTemplateFormValues(slug, content);

  return (
    <div className="grid gap-6">
      <input type="hidden" name="contentMode" value="template" />
      <p className="text-sm text-muted">{template.description}</p>
      {template.sections.map((section) => (
        <fieldset key={section.heading} className="grid gap-4 rounded-2xl bg-sand/50 p-5">
          <legend className="px-1 font-serif text-2xl text-forest">{section.heading}</legend>
          {section.help ? <p className="text-sm text-muted">{section.help}</p> : null}

          {(section.fields || []).map((field) => {
            if (field.kind === "checkbox") {
              return (
                <label key={field.key} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={`sec_${field.key}`}
                    defaultChecked={values.fields[field.key] !== "off"}
                    className="mt-1"
                  />
                  <span>
                    {field.label}
                    {field.help ? <span className="mt-1 block text-xs text-muted">{field.help}</span> : null}
                  </span>
                </label>
              );
            }

            if (field.kind === "image") {
              return (
                <div key={field.key} className="grid gap-3">
                  <MediaPicker
                    label={field.label}
                    name={`sec_${field.key}`}
                    defaultUrl={values.fields[field.key] || ""}
                    help={field.help || "Pick from the media library or paste a URL in the library dialog."}
                  />
                  <label className="grid gap-1 text-sm">
                    {field.label} alt text
                    <input
                      name={`sec_${field.key}Alt`}
                      defaultValue={values.fields[`${field.key}Alt`] || ""}
                      className={fieldClass}
                    />
                  </label>
                </div>
              );
            }

            const rows = field.rows || (field.kind === "text" ? 1 : 4);
            if (field.kind === "text") {
              return (
                <label key={field.key} className="grid gap-1 text-sm">
                  {field.label}
                  {field.help ? <span className="text-xs text-muted">{field.help}</span> : null}
                  <input
                    name={`sec_${field.key}`}
                    defaultValue={values.fields[field.key] || ""}
                    className={fieldClass}
                  />
                </label>
              );
            }

            return (
              <label key={field.key} className="grid gap-1 text-sm">
                {field.label}
                {field.help ? <span className="text-xs text-muted">{field.help}</span> : null}
                <textarea
                  name={`sec_${field.key}`}
                  defaultValue={values.fields[field.key] || ""}
                  rows={rows}
                  className={fieldClass}
                />
              </label>
            );
          })}

          {(section.groups || []).map((group) => {
            const items = values.groups[group.key] || [];
            return (
              <div key={group.key} className="grid gap-4">
                <input type="hidden" name={`grp_${group.key}_count`} value={items.length} />
                {group.help ? <p className="text-xs text-muted">{group.help}</p> : null}
                {items.map((item, index) => (
                  <div key={`${group.key}-${index}`} className="grid gap-3 rounded-2xl bg-sand/60 p-4">
                    <p className="text-sm font-medium text-forest">
                      {group.itemLabel} {index + 1}
                    </p>
                    {group.fields.map((field) =>
                      field.kind === "text" ? (
                        <label key={field.key} className="grid gap-1 text-sm">
                          {field.label}
                          <input
                            name={`grp_${group.key}_${index}_${field.key}`}
                            defaultValue={item[field.key] || ""}
                            className={fieldClass}
                          />
                        </label>
                      ) : (
                        <label key={field.key} className="grid gap-1 text-sm">
                          {field.label}
                          <textarea
                            name={`grp_${group.key}_${index}_${field.key}`}
                            defaultValue={item[field.key] || ""}
                            rows={field.rows || 3}
                            className={fieldClass}
                          />
                        </label>
                      ),
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}

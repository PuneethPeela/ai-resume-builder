/**
 * Utility functions to export resume data as JSON and native-compatible DOCX structures.
 */

import { ResumeFormData } from "@/types/resume";

/**
 * Exports active resume data as a serialized .json file.
 */
export function exportToJSON(data: ResumeFormData, title: string = "resume") {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  const filename = `${title.toLowerCase().replace(/\s+/g, "_")}_resume.json`;
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Exports active resume data as a styled Word Document (.docx) using an inline HTML schema.
 * Microsoft Word natively opens this and compiles it perfectly as an editable structured document.
 */
export function exportToDOCX(data: ResumeFormData, title: string = "resume") {
  const {
    personalInfo = { firstName: "", lastName: "", email: "", phone: "", location: "" },
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = data;

  const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim();
  
  const formatUrl = (url?: string) => {
    if (!url) return "";
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  // Compile Work Experience Section
  const experienceHtml = experience
    .map(
      (exp) => `
      <div style="margin-bottom: 12pt;">
        <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; font-size: 11pt; color: #111111; font-family: 'Arial', sans-serif;">
              ${exp.position || "Position"} &mdash; <span style="font-weight: normal; color: #444444;">${exp.company || "Company"}</span>
            </td>
            <td style="text-align: right; font-size: 9.5pt; color: #666666; font-family: 'Arial', sans-serif;">
              ${exp.startDate || ""} &ndash; ${exp.current ? "Present" : exp.endDate || ""}
              ${exp.location ? ` | ${exp.location}` : ""}
            </td>
          </tr>
        </table>
        ${
          exp.bullets && exp.bullets.length > 0
            ? `<ul style="margin-top: 3pt; margin-bottom: 0; padding-left: 20px; font-size: 9.5pt; color: #333333; line-height: 1.35; font-family: 'Arial', sans-serif;">
                ${exp.bullets
                  .filter((b) => b.trim() !== "")
                  .map((b) => `<li style="margin-bottom: 2pt;">${b}</li>`)
                  .join("")}
               </ul>`
            : ""
        }
      </div>`
    )
    .join("");

  // Compile Education Section
  const educationHtml = education
    .map(
      (edu) => `
      <div style="margin-bottom: 8pt;">
        <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; font-size: 11pt; color: #111111; font-family: 'Arial', sans-serif;">
              ${edu.institution || "Institution"}
              <span style="font-weight: normal; color: #444444;"> &mdash; ${edu.degree || ""} in ${edu.field || ""}</span>
            </td>
            <td style="text-align: right; font-size: 9.5pt; color: #666666; font-family: 'Arial', sans-serif;">
              ${edu.startDate || ""} &ndash; ${edu.endDate || ""}
              ${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
            </td>
          </tr>
        </table>
      </div>`
    )
    .join("");

  // Compile Projects Section
  const projectsHtml = projects
    .map(
      (proj) => `
      <div style="margin-bottom: 10pt;">
        <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; font-size: 11pt; color: #111111; font-family: 'Arial', sans-serif;">
              ${proj.name || "Project"}
              ${
                proj.technologies && proj.technologies.length > 0
                  ? `<span style="font-weight: normal; font-size: 8.5pt; color: #666666;"> [${proj.technologies.join(
                      ", "
                    )}]</span>`
                  : ""
              }
            </td>
            <td style="text-align: right; font-size: 9.5pt; color: #666666; font-family: 'Arial', sans-serif;">
              ${formatUrl(proj.liveUrl || proj.githubUrl || "")}
            </td>
          </tr>
        </table>
        <p style="margin-top: 2pt; margin-bottom: 0; font-size: 9.5pt; color: #333333; line-height: 1.35; font-family: 'Arial', sans-serif;">
          ${proj.description || ""}
        </p>
      </div>`
    )
    .join("");

  // Compile Certifications Section
  const certificationsHtml = certifications
    .map(
      (cert) => `
      <tr style="font-size: 9.5pt; color: #333333; font-family: 'Arial', sans-serif;">
        <td style="padding-bottom: 4pt; font-family: 'Arial', sans-serif;">
          <span style="font-weight: bold; color: #111111;">${cert.name || ""}</span> &mdash; ${cert.issuer || ""}
        </td>
        <td style="text-align: right; padding-bottom: 4pt; color: #666666; font-family: 'Arial', sans-serif;">
          ${cert.date || ""}
        </td>
      </tr>`
    )
    .join("");

  // Construct absolute layout inside standard Office XML container
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>${fullName || "Resume"}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 8.5in 11.0in;
          margin: 0.75in 0.75in 0.75in 0.75in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          color: #333333;
        }
        h2 {
          font-size: 18pt;
          font-weight: bold;
          color: #111111;
          margin: 0 0 4pt 0;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
        }
        .header-links {
          text-align: center;
          font-size: 9pt;
          color: #555555;
          margin-bottom: 15pt;
        }
        .section-title {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          color: #111111;
          border-bottom: 1.5pt solid #222222;
          padding-bottom: 2pt;
          margin-top: 15pt;
          margin-bottom: 8pt;
        }
      </style>
    </head>
    <body>
      <h2>${fullName || "Your Full Name"}</h2>
      <div class="header-links">
        ${[
          personalInfo.email,
          personalInfo.phone,
          personalInfo.location,
          personalInfo.linkedin ? formatUrl(personalInfo.linkedin) : "",
          personalInfo.github ? formatUrl(personalInfo.github) : "",
          personalInfo.portfolio ? formatUrl(personalInfo.portfolio) : "",
        ]
          .filter(Boolean)
          .join(" &bull; ")}
      </div>

      ${
        summary
          ? `<div class="section-title" style="font-family: 'Arial', sans-serif;">Professional Summary</div>
             <p style="margin: 0 0 10pt 0; font-size: 9.5pt; color: #333333; text-align: justify; line-height: 1.4; font-family: 'Arial', sans-serif;">
               ${summary}
             </p>`
          : ""
      }

      ${
        experienceHtml
          ? `<div class="section-title" style="font-family: 'Arial', sans-serif;">Work Experience</div>
             <div>${experienceHtml}</div>`
          : ""
      }

      ${
        educationHtml
          ? `<div class="section-title" style="font-family: 'Arial', sans-serif;">Education</div>
             <div>${educationHtml}</div>`
          : ""
      }

      ${
        skills && skills.length > 0
          ? `<div class="section-title" style="font-family: 'Arial', sans-serif;">Skills</div>
             <p style="margin: 0 0 10pt 0; font-size: 9.5pt; color: #333333; font-family: 'Arial', sans-serif;">
               <strong>Technical Skills:</strong> ${skills.join(", ")}
             </p>`
          : ""
      }

      ${
        projectsHtml
          ? `<div class="section-title" style="font-family: 'Arial', sans-serif;">Projects</div>
             <div>${projectsHtml}</div>`
          : ""
      }

      ${
        certificationsHtml
          ? `<div class="section-title" style="font-family: 'Arial', sans-serif;">Certifications</div>
             <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
               ${certificationsHtml}
             </table>`
          : ""
      }
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword",
  });

  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = url;
  const filename = `${title.toLowerCase().replace(/\s+/g, "_")}_resume.docx`;
  downloadAnchor.download = filename;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
}

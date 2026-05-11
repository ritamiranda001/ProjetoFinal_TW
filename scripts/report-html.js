"use strict";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const chip = (status) => {
  if (status === "pass") return '<span class="chip good">✅ Cumpriu</span>';
  if (status === "skipped")
    return '<span class="chip muted">⏭️ Não verificado</span>';
  return '<span class="chip bad">❌ Não</span>';
};

const CSS = `
  :root {
    --bg: #0b1020;
    --text: #e5e7eb;
    --muted: #a8b0c2;
    --line: rgba(255,255,255,0.08);
    --shadow: 0 12px 30px rgba(0,0,0,.35);
  }

  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,"Noto Sans","Apple Color Emoji","Segoe UI Emoji";
    background: radial-gradient(1200px 700px at 20% 0%, rgba(56,189,248,.18), transparent 55%),
                radial-gradient(1200px 700px at 90% 10%, rgba(34,197,94,.14), transparent 60%),
                var(--bg);
    color: var(--text);
    line-height: 1.4;
  }

  .container { max-width: 980px; margin: 28px auto; padding: 0 18px 28px; }
  .mock-banner {
    background: rgba(245,158,11,.15);
    border: 1px solid rgba(245,158,11,.3);
    border-radius: 10px;
    padding: 10px 16px;
    margin-bottom: 16px;
    color: #fde68a;
    font-size: 13px;
    font-weight: 700;
  }
  .header {
    display:flex;
    gap:16px;
    align-items:stretch;
    justify-content:space-between;
    flex-wrap:wrap;
  }

  .title, .summary {
    min-height: 200px;
    border:1px solid var(--line);
    border-radius:18px;
    box-shadow: var(--shadow);
  }

  .title {
    position: relative;
    padding:18px;
    background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
    flex:1 1 520px;
    min-width:320px;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    gap:14px;
  }

  .kicker {
    color: var(--muted);
    font-weight:800;
    letter-spacing:.8px;
    text-transform:uppercase;
    font-size:12px;
    display:flex;
    gap:10px;
    align-items:center;
    flex-wrap:wrap;
  }

  .epoca-pill {
    position:absolute;
    top:16px;
    right:16px;
    border:1px solid var(--line);
    border-radius:999px;
    padding:6px 10px;
    background: rgba(255,255,255,.03);
    display:inline-flex;
    gap:8px;
    align-items:center;
    color: var(--text);
    font-weight:800;
    font-size:12px;
    white-space:nowrap;
  }

  .main-title {
    display:flex;
    align-items:baseline;
    gap:12px;
    flex-wrap:wrap;
    margin-top:2px;
  }
  .main-title .big {
    margin:0;
    font-size:34px;
    font-weight:900;
    line-height:1.05;
  }

  .tema {
    margin:0;
    font-size:18px;
    font-weight:850;
    color:#dbeafe;
  }

  .pill {
    border:1px solid var(--line);
    border-radius:999px;
    padding:8px 12px;
    background: rgba(255,255,255,.03);
    display:inline-flex;
    gap:10px;
    align-items:center;
    font-weight:850;
    color: var(--text);
    width: fit-content;
  }

  .members {
    margin:0;
    padding-left: 28px;
    list-style: disc;
  }
  .members li {
    margin:8px 0;
    padding-left: 10px;
  }
  .name { font-weight:700; }

  .summary {
    flex:0 0 320px;
    min-width:320px;
    background: rgba(15,23,42,.88);
    padding:18px;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
  }

  .sum-label {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #c7d2fe;
    margin-bottom: 8px;
  }

  .sum-big {
    font-size: 34px;
    font-weight: 900;
    line-height: 1.1;
    padding: 10px 14px;
    border-radius: 14px;
    border: 1px solid var(--line);
    box-shadow:
      inset 0 0 0 1px rgba(255,255,255,.02),
      0 8px 18px rgba(0,0,0,.35);
    width: fit-content;
  }
  .sum-big small {
    font-size: 14px;
    font-weight: 800;
    color: var(--muted);
    margin-left: 6px;
  }

  .sum-breakdown {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--line);
    display: grid;
    gap: 16px;
  }
  .sum-section {
    display:flex;
    flex-direction:column;
    gap:6px;
  }
  .sum-title {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: #dbeafe;
  }

  .sum-value {
    font-size: 20px;
    font-weight: 900;
    padding: 8px 12px;
    border-radius: 12px;
    border: 1px solid var(--line);
    width: fit-content;
    box-shadow:
      inset 0 0 0 1px rgba(255,255,255,.02),
      0 6px 14px rgba(0,0,0,.28);
  }
  .sum-value span {
    font-size: 13px;
    font-weight: 800;
    color: var(--muted);
    margin-left: 6px;
  }

  .grade-bad  { color: #fecaca; text-shadow: 0 0 6px rgba(239,68,68,.25); }
  .grade-ok   { color: #fde68a; text-shadow: 0 0 6px rgba(245,158,11,.25); }
  .grade-good { color: #bbf7d0; text-shadow: 0 0 6px rgba(34,197,94,.25); }

  .grid {
    display:grid;
    grid-template-columns: 1fr;
    gap:16px;
    margin-top:16px;
  }
  .card {
    border:1px solid var(--line);
    background: rgba(15,23,42,.75);
    border-radius:18px;
    padding:16px;
    box-shadow: var(--shadow);
  }
  .card h2 { margin:0 0 10px; font-size:16px; color: #dbeafe; }

  .table-card {
    margin-top:16px;
    border:1px solid var(--line);
    background: rgba(15,23,42,.8);
    border-radius:18px;
    overflow:hidden;
    box-shadow: var(--shadow);
  }
  .table-head {
    padding:12px 16px;
    background: linear-gradient(90deg, rgba(56,189,248,.18), rgba(34,197,94,.12));
    border-bottom:1px solid var(--line);
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;
  }
  .table-head .meta { color: var(--muted); font-size:12px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th, td { padding:12px; border-bottom:1px solid var(--line); vertical-align:top; }
  th {
    text-align:left;
    color:#c7d2fe;
    font-size:12px;
    letter-spacing:.2px;
    text-transform:uppercase;
  }
  .score { font-weight:900; white-space:nowrap; }
  .chip {
    display:inline-block;
    padding:6px 10px;
    border-radius:999px;
    border:1px solid var(--line);
    font-weight:750;
    font-size:12px;
    white-space:nowrap;
  }
  .chip.good  { background: rgba(34,197,94,.12);  color: #bbf7d0; }
  .chip.bad   { background: rgba(239,68,68,.12);   color: #fecaca; }
  .chip.muted { background: rgba(255,255,255,.04); color: var(--muted); }

  .footer {
    margin-top:18px;
    border-top:1px solid var(--line);
    padding-top:12px;
    color: var(--muted);
    font-size:12px;
    text-align:center;
  }

  @media print {
    body { background:white; color:#111827; }
    .container { margin:0; max-width:none; }
    .title, .summary, .card, .table-card { box-shadow:none !important; background:white !important; border:1px solid #e5e7eb !important; }
    .table-head { background:#f3f4f6 !important; }
    th { color:#111827 !important; }
    .meta, .kicker, .footer, .sum-value span, .sum-big small { color:#4b5563 !important; }
    .epoca-pill { background:#f3f4f6 !important; border:1px solid #e5e7eb !important; color:#111827 !important; }
    .grade-bad  { color:#991b1b !important; text-shadow:none !important; }
    .grade-ok   { color:#854d0e !important; text-shadow:none !important; }
    .grade-good { color:#166534 !important; text-shadow:none !important; }
    .chip.good  { background:#dcfce7 !important; color:#166534 !important; }
    .chip.bad   { background:#fee2e2 !important; color:#991b1b !important; }
    .chip.muted { background:#f3f4f6 !important; color:#4b5563 !important; }
  }
`;

/**
 * @param {object} report   - { score, maxScore, percentage, checks: { structure, lint, tests, build } }
 * @param {object} projectInfo - { groupMembers, projectTheme, apiName, apiLink, apiKey, backendLink }
 * @param {object} analysis - { components, services, models, featureFiles, sharedFiles, specFiles, hasRealRoutes, routeCount, infoFilled, unfilledFields, isDefaultApp }
 * @param {object} [options] - { groupLabel, isMock }
 */
function generateHtmlReport(report, projectInfo, analysis, options = {}) {
  const { groupLabel = "Grupo", isMock = false } = options;
  const gradeClass =
    report.score >= 14 ? "good" : report.score >= 10 ? "ok" : "bad";

  const membersList =
    projectInfo.groupMembers.length > 0
      ? `<ul class="members">${projectInfo.groupMembers
          .map((m) => `<li><span class="name">${escapeHtml(m)}</span></li>`)
          .join("")}</ul>`
      : `<p style="color:var(--muted)">Sem dados de grupo.</p>`;

  const analysisRows = [
    {
      label: "Componentes criados",
      sub: "(*.component.ts)",
      value: analysis.components,
      ok: analysis.components > 1,
      observation:
        analysis.components > 5
          ? `${analysis.components} componentes — boa decomposição da interface`
          : analysis.components > 1
            ? `${analysis.components} componentes — estrutura básica presente`
            : "Apenas o app.component default — interface não decomposta em componentes",
    },
    {
      label: "Serviços criados",
      sub: "(core/services/*.service.ts)",
      value: analysis.services,
      ok: analysis.services > 0,
      observation:
        analysis.services > 2
          ? `${analysis.services} serviços — boa separação de responsabilidades`
          : analysis.services > 0
            ? `${analysis.services} serviço(s) — lógica parcialmente isolada`
            : "Nenhum serviço — lógica provavelmente misturada nos componentes",
    },
    {
      label: "Modelos criados",
      sub: "(core/models/)",
      value: analysis.models,
      ok: analysis.models > 0,
      observation:
        analysis.models > 2
          ? `${analysis.models} modelos — boa tipagem dos dados`
          : analysis.models > 0
            ? `${analysis.models} modelo(s) — tipagem parcial dos dados`
            : "Nenhum modelo — dados provavelmente sem tipagem (any / object)",
    },
    {
      label: "Ficheiros em features/",
      sub: "(features/)",
      value: analysis.featureFiles,
      ok: analysis.featureFiles > 0,
      observation:
        analysis.featureFiles > 8
          ? `${analysis.featureFiles} ficheiros — funcionalidades bem desenvolvidas`
          : analysis.featureFiles > 0
            ? `${analysis.featureFiles} ficheiros — desenvolvimento incipiente`
            : "Pasta vazia — funcionalidades não implementadas",
    },
    {
      label: "Ficheiros em shared/",
      sub: "(shared/)",
      value: analysis.sharedFiles,
      ok: analysis.sharedFiles > 0,
      observation:
        analysis.sharedFiles > 3
          ? `${analysis.sharedFiles} ficheiros — componentes reutilizáveis presentes`
          : analysis.sharedFiles > 0
            ? `${analysis.sharedFiles} ficheiro(s) — partilha de código limitada`
            : "Pasta vazia — sem componentes ou pipes partilhados",
    },
    {
      label: "Rotas definidas",
      sub: "(app.routes.ts)",
      value: analysis.routeCount,
      ok: analysis.hasRealRoutes,
      observation:
        analysis.routeCount > 3
          ? `${analysis.routeCount} rotas — navegação bem estruturada`
          : analysis.hasRealRoutes
            ? `${analysis.routeCount} rota(s) — navegação básica`
            : "Sem rotas definidas — aplicação sem navegação entre páginas",
    },
    {
      label: "Testes escritos",
      sub: "(*.spec.ts)",
      value: analysis.specFiles,
      ok: analysis.specFiles > 1,
      observation:
        analysis.specFiles > 4
          ? `${analysis.specFiles} ficheiros de teste — boa cobertura`
          : analysis.specFiles > 1
            ? `${analysis.specFiles} ficheiros de teste — cobertura parcial`
            : "Apenas o spec default do Angular CLI — sem testes escritos pelos alunos",
    },
    {
      label: "App component alterado",
      sub: "",
      value: analysis.isDefaultApp ? "Não" : "Sim",
      ok: !analysis.isDefaultApp,
      observation: analysis.isDefaultApp
        ? "Componente principal ainda com o título default do Angular CLI"
        : "Componente principal modificado",
    },
    {
      label: "PROJECT_INFO.md preenchido",
      sub: "",
      value: analysis.infoFilled ? "Sim" : "Não",
      ok: analysis.infoFilled,
      observation: analysis.infoFilled
        ? "Todos os campos preenchidos"
        : `Campos por preencher: ${(analysis.unfilledFields || []).join(", ")}`,
    },
  ]
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.label)}${row.sub ? ` <span style="color:var(--muted);font-size:11px;">${escapeHtml(row.sub)}</span>` : ""}</td>
        <td class="score">${escapeHtml(row.value)}</td>
        <td>${row.ok ? '<span class="chip good">✅ OK</span>' : '<span class="chip bad">⚠️ Atenção</span>'}</td>
        <td style="color:var(--muted);font-size:12px;">${escapeHtml(row.observation)}</td>
      </tr>`,
    )
    .join("");

  const missingList =
    (report.checks.structure.missing || []).length > 0
      ? escapeHtml(report.checks.structure.missing.join(", "))
      : "—";

  return `<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Technologias Web — ${escapeHtml(groupLabel)} (${escapeHtml(projectInfo.projectTheme || "Tema")})</title>
    <style>${CSS}</style>
  </head>
  <body>
    <div class="container">
      ${isMock ? `<div class="mock-banner">⚠️ Relatório simulado — dados fictícios para demonstração</div>` : ""}

      <div class="header">
        <div class="title">
          <div class="epoca-pill">📚 Época: <b>Época Normal</b></div>
          <div>
            <div class="kicker">TECHNOLOGIAS WEB • AVALIAÇÃO PRÁTICA</div>
            <div class="main-title">
              <h1 class="big">${escapeHtml(groupLabel)}</h1>
            </div>
            <p class="tema">🎯 Tema: ${escapeHtml(projectInfo.projectTheme || "-")}</p>
            <div style="margin-top:12px;">
              <div class="pill">👥 Elementos</div>
              ${membersList}
            </div>
          </div>
        </div>

        <div class="summary">
          <div>
            <div class="sum-label">🎯 NOTA FINAL</div>
            <div class="sum-big grade-${gradeClass}">
              ${escapeHtml(report.score)} <small>valores</small>
            </div>
            <div class="sum-breakdown">
              <div class="sum-section">
                <div class="sum-title">🧱 OBJETIVOS</div>
                <div class="sum-value grade-${gradeClass}">
                  ${escapeHtml(report.score)}
                  <span>valores / ${escapeHtml(report.maxScore)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h2>🧠 Feedback final</h2>
          <div style="white-space:pre-wrap;">—</div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-head">
          <div><b>🧱 Objetivos Principais</b> <span class="meta">— (máx ${escapeHtml(report.maxScore)} valores)</span></div>
          <div class="meta">❌ Não • ✅ Cumpriu • ⏭️ Não verificado</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:44%;">Critério</th>
              <th style="width:10%;">Pontos</th>
              <th style="width:20%;">Estado</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Estrutura mínima</td>
              <td class="score">${escapeHtml(report.checks.structure.score)}/${escapeHtml(report.checks.structure.maxScore)}</td>
              <td>${chip(report.checks.structure.status)}</td>
              <td>
                ${
                  (report.checks.structure.missing || []).length > 0
                    ? `<span style="color:#fecaca;font-size:12px;">Pastas/ficheiros em falta:</span><ul style="margin:4px 0 0;padding-left:16px;font-size:12px;color:var(--muted);">${(report.checks.structure.missing || []).map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>`
                    : '<span style="color:#bbf7d0;font-size:12px;">Todos os ficheiros e pastas obrigatórios estão presentes.</span>'
                }
                ${report.checks.structure.notes ? `<p style="margin:6px 0 0;font-size:12px;color:var(--muted);">${escapeHtml(report.checks.structure.notes)}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td>Lint</td>
              <td class="score">${escapeHtml(report.checks.lint.score)}/${escapeHtml(report.checks.lint.maxScore)}</td>
              <td>${chip(report.checks.lint.status)}</td>
              <td>
                ${
                  report.checks.lint.status === "pass"
                    ? '<span style="color:#bbf7d0;font-size:12px;">Sem erros de lint — código segue as regras de estilo.</span>'
                    : report.checks.lint.status === "skipped"
                      ? '<span style="color:var(--muted);font-size:12px;">Não verificado (estrutura incompleta).</span>'
                      : ""
                }
                ${report.checks.lint.output ? `<details style="margin-top:6px;"><summary style="font-size:12px;cursor:pointer;">Ver erros de lint</summary><pre style="margin:6px 0 0;font-size:11px;">${escapeHtml(report.checks.lint.output)}</pre></details>` : ""}
                ${report.checks.lint.notes ? `<p style="margin:6px 0 0;font-size:12px;color:var(--muted);">${escapeHtml(report.checks.lint.notes)}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td>Build</td>
              <td class="score">${escapeHtml(report.checks.build.score)}/${escapeHtml(report.checks.build.maxScore)}</td>
              <td>${chip(report.checks.build.status)}</td>
              <td>
                ${
                  report.checks.build.status === "pass"
                    ? '<span style="color:#bbf7d0;font-size:12px;">Projeto compila sem erros.</span>'
                    : report.checks.build.status === "skipped"
                      ? '<span style="color:var(--muted);font-size:12px;">Não verificado (estrutura incompleta).</span>'
                      : '<span style="color:#fecaca;font-size:12px;">Erro de compilação — o projeto não faz build.</span>'
                }
                ${report.checks.build.notes ? `<p style="margin:6px 0 0;font-size:12px;color:var(--muted);">${escapeHtml(report.checks.build.notes)}</p>` : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <div class="table-head">
          <div><b>📌 Informação do projeto</b></div>
          <div class="meta">Fonte: PROJECT_INFO.md</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:44%;">Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>API</td><td>${escapeHtml(projectInfo.apiName || "-")}</td></tr>
            <tr><td>API link</td><td>${escapeHtml(projectInfo.apiLink || "-")}</td></tr>
            <tr><td>Requer API key</td><td>${escapeHtml(projectInfo.apiKey || "-")}</td></tr>
            <tr><td>Backend</td><td>${escapeHtml(projectInfo.backendLink || "-")}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <div class="table-head">
          <div><b>🔍 Análise estática do código</b></div>
          <div class="meta">Gerado automaticamente</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:36%;">Indicador</th>
              <th style="width:8%;">Valor</th>
              <th style="width:14%;">Estado</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>${analysisRows}</tbody>
        </table>
      </div>

      <div class="footer">
        🎓 <b>Technologias Web</b> • 📆 <b>Ano letivo 2025/2026</b>
      </div>
    </div>
  </body>
</html>`;
}

module.exports = { generateHtmlReport };

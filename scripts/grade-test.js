const fs = require("fs");
const path = require("path");
const { generateHtmlReport } = require("./report-html");

const outDir = path.resolve(__dirname, "..");

const groups = [
  {
    filename: "grade-report-test-grupo01.html",
    options: { groupLabel: "Grupo 01", isMock: true },
    projectInfo: {
      groupMembers: [
        "João Ferreira — 31001",
        "Ana Costa — 31002",
        "Pedro Matos — 31003",
      ],
      projectTheme: "WeatherNow — Previsão meteorológica em tempo real",
      apiName: "OpenWeatherMap",
      apiLink: "https://openweathermap.org/api",
      apiKey: "Sim",
      backendLink: "https://github.com/ipvc-tweb/grupo01-backend",
    },
    report: {
      score: 20,
      maxScore: 20,
      percentage: 100,
      checks: {
        structure: { status: "pass", score: 10, maxScore: 10, missing: [] },
        lint: { status: "pass", score: 5, maxScore: 5, output: "" },
        build: {
          status: "pass",
          score: 5,
          maxScore: 5,
          output: "",
          notes: "Build sem avisos.",
        },
      },
    },
    analysis: {
      components: 7,
      services: 3,
      models: 4,
      featureFiles: 15,
      sharedFiles: 6,
      specFiles: 6,
      hasRealRoutes: true,
      routeCount: 4,
      infoFilled: true,
      unfilledFields: [],
      isDefaultApp: false,
    },
  },
  {
    filename: "grade-report-test-grupo02.html",
    options: { groupLabel: "Grupo 02", isMock: true },
    projectInfo: {
      groupMembers: ["Mariana Silva — 31010", "Tiago Rodrigues — 31011"],
      projectTheme: "FilmTrack — Gestão de filmes e séries",
      apiName: "The Movie Database (TMDB)",
      apiLink: "https://api.themoviedb.org/3",
      apiKey: "Sim",
      backendLink: "https://github.com/ipvc-tweb/grupo02-backend",
    },
    report: {
      score: 15,
      maxScore: 20,
      percentage: 75,
      checks: {
        structure: { status: "pass", score: 10, maxScore: 10, missing: [] },
        lint: {
          status: "fail",
          score: 0,
          maxScore: 5,
          output:
            "film-list.component.ts:18  error  @typescript-eslint/no-explicit-any\n\n1 error",
          notes: "Corrigir o tipo `any` em film-list.component.ts linha 18.",
        },
        build: { status: "pass", score: 5, maxScore: 5, output: "" },
      },
    },
    analysis: {
      components: 5,
      services: 2,
      models: 3,
      featureFiles: 9,
      sharedFiles: 3,
      specFiles: 3,
      hasRealRoutes: true,
      routeCount: 3,
      infoFilled: true,
      unfilledFields: [],
      isDefaultApp: false,
    },
  },
  {
    filename: "grade-report-test-grupo03.html",
    options: { groupLabel: "Grupo 03", isMock: true },
    projectInfo: {
      groupMembers: [
        "Beatriz Santos — 31020",
        "Rui Oliveira — 31021",
        "Inês Pereira — 31022",
      ],
      projectTheme: "CityExplorer — Explorador de cidades",
      apiName: "Foursquare Places",
      apiLink: "https://developer.foursquare.com/docs/places-api",
      apiKey: "Sim",
      backendLink: "https://github.com/ipvc-tweb/grupo03-backend",
    },
    report: {
      score: 15,
      maxScore: 20,
      percentage: 75,
      checks: {
        structure: { status: "pass", score: 10, maxScore: 10, missing: [] },
        lint: {
          status: "fail",
          score: 0,
          maxScore: 5,
          output:
            "app.component.ts:12  error  no-console\ncity.service.ts:8   error  @typescript-eslint/no-explicit-any\ncity.service.ts:31  error  @typescript-eslint/no-explicit-any\n\n3 errors",
          notes: "Uso de console.log e any. Remover antes da entrega.",
        },
        build: { status: "pass", score: 5, maxScore: 5, output: "" },
      },
    },
    analysis: {
      components: 3,
      services: 1,
      models: 1,
      featureFiles: 4,
      sharedFiles: 1,
      specFiles: 1,
      hasRealRoutes: true,
      routeCount: 2,
      infoFilled: true,
      unfilledFields: [],
      isDefaultApp: false,
    },
  },
  {
    filename: "grade-report-test-grupo04.html",
    options: { groupLabel: "Grupo 04", isMock: true },
    projectInfo: {
      groupMembers: ["Carlos Mendes — 31030", "Sofia Lima — 31031"],
      projectTheme: "BookShelf — Estante virtual de livros",
      apiName: "Open Library",
      apiLink: "https://openlibrary.org/developers/api",
      apiKey: "Não",
      backendLink: "-",
    },
    report: {
      score: 5,
      maxScore: 20,
      percentage: 25,
      checks: {
        structure: {
          status: "fail",
          score: 5,
          maxScore: 10,
          missing: [
            "src/app/core/services",
            "src/app/core/models",
            "src/app/features",
            "src/app/shared",
            "src/app/app.routes.ts",
          ],
          notes:
            "Projeto claramente não seguiu a estrutura base do template. Parece um projeto feito de raiz sem usar o repositório fornecido.",
        },
        lint: { status: "skipped", score: 0, maxScore: 5, output: "" },
        build: {
          status: "skipped",
          score: 0,
          maxScore: 5,
          output: "",
          notes:
            "Não foi possível verificar — estrutura incompleta impede a execução dos checks.",
        },
      },
    },
    analysis: {
      components: 1,
      services: 0,
      models: 0,
      featureFiles: 0,
      sharedFiles: 0,
      specFiles: 1,
      hasRealRoutes: false,
      routeCount: 0,
      infoFilled: false,
      unfilledFields: [
        "Student 1:",
        "Student 2:",
        "- API name:",
        "- API link:",
      ],
      isDefaultApp: true,
    },
  },
];

groups.forEach(({ filename, options, projectInfo, report, analysis }) => {
  const html = generateHtmlReport(report, projectInfo, analysis, options);
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, html, "utf8");
  console.log(
    `Generated: ${filename}  (${report.score}/${report.maxScore} valores)`,
  );
});

console.log("\nAll test reports generated.");

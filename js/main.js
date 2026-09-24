const projects = [
  {
    name: "Campus Task 校园任务管理网页",
    summary: "面向学生日常学习场景设计的任务管理网页，可记录课程作业、截止时间和完成状态，并通过不同状态标识区分待完成、进行中和已完成任务。项目重点练习了网页布局、表单交互、DOM 操作和本地数据管理。",
    tech: ["HTML", "CSS", "JavaScript"],
    date: "2026年6月",
    category: "Web 应用",
    visualTitle: "Campus Task 校园任务管理网页",
    visualTag: "项目图片：暂无"
  },
  {
    name: "AI Study Assistant 学习助手",
    summary: "一个面向学生的 AI 学习辅助项目，主要用于课程资料整理、知识点问答和学习计划生成。项目尝试使用自然语言描述需求，并通过 AI 辅助完成页面设计、代码生成和功能调整，重点实践了 AI 辅助开发的基本流程。",
    tech: ["HTML", "CSS", "JavaScript", "AI 编程工具"],
    date: "2026年9月",
    category: "AI 应用",
    visualTitle: "AI Study Assistant 学习助手",
    visualTag: "项目图片：暂无"
  },
  {
    name: "Study Data 学习数据可视化面板",
    summary: "用于展示个人学习情况的前端数据面板，通过图表和统计信息展示学习时长、课程进度、任务完成数量等数据。项目重点练习了数据展示、页面信息层级和响应式布局，并尝试通过不同视觉元素让学习数据更加直观。",
    tech: ["HTML", "CSS", "JavaScript"],
    date: "2026年9月",
    category: "数据可视化",
    visualTitle: "Study Data 学习数据可视化面板",
    visualTag: "项目图片：暂无"
  }
];

const layoutClasses = ["layout-a", "layout-b", "layout-c"];
const projectList = document.querySelector("#projectList");

function renderProjects() {
  projectList.innerHTML = projects
    .map((project, index) => {
      const number = String(index + 1).padStart(2, "0");
      const layout = layoutClasses[index % layoutClasses.length];
      const techItems = project.tech.map((item) => `<span>${item}</span>`).join("");

      return `
        <article class="project-panel ${layout}" data-section="project">
          <div class="project-number" aria-hidden="true">${number}</div>
          <div class="project-visual-wrap" aria-label="${project.name} 项目图片">
            <div class="project-visual" role="img" aria-label="${project.name} 项目图片：暂无">
              <div class="visual-screen">
                <strong>${project.visualTitle}</strong>
                <span>${project.visualTag}</span>
              </div>
            </div>
          </div>
          <div class="project-copy">
            <h3 class="project-title">${project.name}</h3>
            <span class="project-category-tag">${project.category}</span>
            <p class="project-desc">${project.summary}</p>
            <div class="project-meta" aria-label="项目元信息">
              <span>${project.date}</span>
              <span>${project.category}</span>
            </div>
            <div class="tech-list" aria-label="技术栈">
              ${techItems}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setupNavState() {
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: "-24% 0px -30% 0px",
      threshold: 0.12
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupNavLinks() {
  const navLinks = [...document.querySelectorAll(".nav-link")];

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) return;

      event.preventDefault();
      navLinks.forEach((item) => item.classList.toggle("active", item === link));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", link.getAttribute("href"));
    });
  });
}

function syncInitialHash() {
  if (!window.location.hash) return;

  window.addEventListener(
    "load",
    () => {
      const target = document.querySelector(window.location.hash);

      if (!target) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "auto", block: "start" });
        });
      });
    },
    { once: true }
  );
}

const THEME_STORAGE_KEY = "portfolio-theme";

function applyTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");

  const toggle = document.querySelector("#themeToggle");
  if (!toggle) return;

  toggle.setAttribute("aria-pressed", String(isLight));
  const icon = toggle.querySelector(".theme-toggle__icon");
  const label = toggle.querySelector(".theme-toggle__label");
  if (icon) icon.textContent = isLight ? "☀" : "☾";
  if (label) label.textContent = isLight ? "LIGHT" : "DARK";
}

function setupThemeToggle() {
  const toggle = document.querySelector("#themeToggle");
  if (!toggle) return;

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    storedTheme = null;
  }
  applyTheme(storedTheme === "light" ? "light" : "dark");

  toggle.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      /* localStorage 不可用时仅切换当前页主题，不影响浏览 */
    }
  });
}

function setupProjectReveal() {
  const panels = [...document.querySelectorAll(".project-panel")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -14% 0px",
      threshold: 0.2
    }
  );

  panels.forEach((panel) => observer.observe(panel));
}

renderProjects();
setupThemeToggle();
setupNavState();
setupNavLinks();
setupProjectReveal();
syncInitialHash();

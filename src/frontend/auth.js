(function () {
  var root = document.getElementById("app");
  if (!root) {
    return;
  }

  var page = document.body.dataset.page || "login";
  var queryRole = new URLSearchParams(window.location.search).get("role");
  var role = queryRole || document.body.dataset.role || "passenger";

  var roleLabelMap = {
    passenger: "旅客",
    admin: "管理员"
  };

  var navOrder = ["passenger", "admin"];

  var pageConfig = {
    login: {
      tag: "登录",
      titleMap: {
        passenger: "旅客登录",
        admin: "管理员登录"
      },
      copyMap: {
        passenger: "登录后进入查票、购票、订单、退票和改签等旅客功能。",
        admin: "后台入口单独分层，后续接车次维护、余票调整和状态管理。"
      }
    },
    register: {
      tag: "注册",
      titleMap: {
        passenger: "旅客注册",
        admin: "管理员注册"
      },
      copyMap: {
        passenger: "旅客注册先保留最小字段集，后续再补实名和业务校验。",
        admin: "保留管理员注册入口结构，但默认不做公开自助注册。"
      }
    },
    "forgot-password": {
      tag: "忘记密码",
      titleMap: {
        passenger: "旅客找回密码",
        admin: "管理员找回密码"
      },
      copyMap: {
        passenger: "这是 login 目录下的独立找回密码模块，当前先保留基础输入结构。",
        admin: "这是 login 目录下的独立找回密码模块，管理员入口先保留基础说明和输入结构。"
      }
    }
  };

  function buildTabs(currentPage, currentRole) {
    return navOrder.map(function (item) {
      var activeClass = item === currentRole ? "is-active" : "";
      var href = "../" + currentPage + "/" + item + ".html";
      if (currentPage === "forgot-password") {
        href = "../login/forgot-password.html?role=" + item;
      }
      return (
        '<a class="' +
        activeClass +
        '" href="' + href + '">' +
        roleLabelMap[item] +
        "</a>"
      );
    }).join("");
  }

  function buildFields(currentPage, currentRole) {
    if (currentPage === "login") {
      return (
        '<label class="field">' +
        '<span class="field-label">' + (currentRole === "admin" ? "管理员账号" : "账号") + "</span>" +
        '<input type="text" name="username" placeholder="' + (currentRole === "admin" ? "请输入管理员账号" : "请输入用户名") + '">' +
        "</label>" +
        '<label class="field">' +
        '<span class="field-label">密码</span>' +
        '<input type="password" name="password" placeholder="请输入密码">' +
        "</label>" +
        '<div class="form-meta">' +
        '<label class="checkbox"><input type="checkbox" name="remember"><span>记住密码</span></label>' +
        '<a class="text-link" href="../login/forgot-password.html?role=' + currentRole + '">忘记密码</a>' +
        "</div>" +
        '<button class="primary-btn" type="submit">' + (currentRole === "admin" ? "登录后台" : "登录") + "</button>"
      );
    }

    if (currentPage === "register" && currentRole !== "admin") {
      return (
        '<label class="field">' +
        '<span class="field-label">用户名</span>' +
        '<input type="text" name="username" placeholder="请输入用户名">' +
        "</label>" +
        '<label class="field">' +
        '<span class="field-label">密码</span>' +
        '<input type="password" name="password" placeholder="请输入密码">' +
        "</label>" +
        '<label class="field">' +
        '<span class="field-label">确认密码</span>' +
        '<input type="password" name="confirmPassword" placeholder="请再次输入密码">' +
        "</label>" +
        '<button class="primary-btn" type="submit">完成注册</button>'
      );
    }

    if (currentPage === "forgot-password") {
      return (
        '<label class="field">' +
        '<span class="field-label">' + (currentRole === "admin" ? "管理员账号" : "账号") + "</span>" +
        '<input type="text" name="account" placeholder="' + (currentRole === "admin" ? "请输入管理员账号" : "请输入用户名或手机号") + '">' +
        "</label>" +
        '<label class="field">' +
        '<span class="field-label">' + (currentRole === "admin" ? "绑定信息" : "绑定手机号") + "</span>" +
        '<input type="text" name="binding" placeholder="' + (currentRole === "admin" ? "请输入管理员绑定信息" : "请输入注册手机号") + '">' +
        "</label>" +
        '<button class="primary-btn" type="submit">提交找回申请</button>'
      );
    }

    return "";
  }

  function buildFooter(currentPage, currentRole) {
    if (currentPage === "login") {
      return (
        '<div class="panel-foot">' +
        "<span>还没有账号？</span>" +
        '<a class="text-link" href="../register/' + (currentRole === "admin" ? "passenger" : currentRole) + '.html">去注册</a>' +
        "</div>"
      );
    }

    if (currentPage === "register" && currentRole !== "admin") {
      return (
        '<div class="panel-foot">' +
        "<span>已经有账号？</span>" +
        '<a class="text-link" href="../login/' + currentRole + '.html">去登录</a>' +
        "</div>"
      );
    }

    if (currentPage === "forgot-password") {
      return (
        '<div class="panel-foot">' +
        "<span>想起密码了？</span>" +
        '<a class="text-link" href="../login/' + currentRole + '.html">返回登录</a>' +
        "</div>"
      );
    }

    return (
      '<div class="panel-foot">' +
      "<span>管理员账号建议由系统分配或单独审批。</span>" +
      '<a class="text-link" href="../login/admin.html">返回登录</a>' +
      "</div>"
    );
  }

  function buildAdminRegisterNotice() {
    return (
      '<div class="notice-box">' +
      "<h2>当前处理方式</h2>" +
      "<p>管理员账号通常不建议开放自助注册。这里先保留第三个选项卡和页面入口，后续如果需要，可以改成审批申请或初始化账号流程。</p>" +
      "</div>" +
      '<div class="notice-actions">' +
      '<a class="secondary-btn" href="../register/passenger.html">去旅客注册</a>' +
      '<a class="secondary-btn" href="../login/admin.html">返回管理员登录</a>' +
      "</div>"
    );
  }

  function buildStatusBox() {
    return '<div class="status-slot" data-status-slot></div>';
  }

  function buildFormOpenTag(currentPage, currentRole) {
    if (currentPage === "login") {
      return '<form class="auth-form" action="' + (currentRole === "admin" ? "../home/pages/admin.html" : "../home/pages/passenger.html") + '" method="get">';
    }

    if (currentPage === "register") {
      return '<form class="auth-form" action="../login/' + currentRole + '.html" method="get">';
    }

    if (currentPage === "forgot-password") {
      return '<form class="auth-form" action="../login/' + currentRole + '.html" method="get">';
    }

    return '<form class="auth-form">';
  }

  function attachInteractions() {
    var form = root.querySelector(".auth-form");
    var statusSlot = root.querySelector("[data-status-slot]");

    if (form && page === "login" && statusSlot) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = form.querySelector("input[name='username']").value.trim();
        var password = form.querySelector("input[name='password']").value;
        var targetHome = role === "admin" ? "../home/pages/admin.html" : "../home/pages/passenger.html";

        if (!username || !password) {
          statusSlot.innerHTML =
            '<div class="status-box is-error"><p>登录失败：请输入完整的账号和密码。</p></div>';
          return;
        }

        statusSlot.innerHTML =
          '<div class="status-box is-success"><p>登录成功，正在进入首页。</p></div>';

        window.setTimeout(function () {
          window.location.href = targetHome;
        }, 700);
      });
    }

    if (form && page === "register" && role !== "admin" && statusSlot) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = form.querySelector("input[name='username']").value.trim();
        var password = form.querySelector("input[name='password']").value;
        var confirmPassword = form.querySelector("input[name='confirmPassword']").value;

        if (!username || !password || !confirmPassword) {
          statusSlot.innerHTML =
            '<div class="status-box is-error"><p>注册失败：请把用户名和密码填写完整。</p></div>';
          return;
        }

        if (password !== confirmPassword) {
          statusSlot.innerHTML =
            '<div class="status-box is-error"><p>注册失败：两次输入的密码不一致。</p></div>';
          return;
        }

        statusSlot.innerHTML =
          '<div class="status-box is-success"><p>注册成功，正在跳转到登录页面。</p></div>';

        window.setTimeout(function () {
          window.location.href = "../login/" + role + ".html";
        }, 1100);
      });
    }

    if (form && page === "forgot-password" && statusSlot) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var account = form.querySelector("input[name='account']").value.trim();
        var binding = form.querySelector("input[name='binding']").value.trim();

        if (!account || !binding) {
          statusSlot.innerHTML =
            '<div class="status-box is-error"><p>提交失败：请把找回信息填写完整。</p></div>';
          return;
        }

        statusSlot.innerHTML =
          '<div class="status-box is-success"><p>找回申请已提交，请返回登录页继续操作。</p></div>';
      });
    }
  }

  function render() {
    var config = pageConfig[page];
    var title = config.titleMap[role];
    var copy = config.copyMap[role];
    var tabs = buildTabs(page, role);
    var slogan = role === "admin" ? "Mini-12306 Admin Portal" : "Mini-12306 Passenger Portal";

    var content = "";
    if (page === "register" && role === "admin") {
      content = buildAdminRegisterNotice();
    } else {
      content = buildFormOpenTag(page, role) + buildFields(page, role) + "</form>" + buildStatusBox();
    }

    root.innerHTML =
      '<div class="auth-page">' +
      '<div class="auth-stack">' +
      '<p class="page-slogan">' + slogan + "</p>" +
      '<header class="brand-banner">' +
      '<div class="brand-mark"><img src="../assets/train-logo.svg" alt="Mini-12306 火车标志"></div>' +
      '<div class="brand-copy">' +
      "<strong>Mini-12306</strong>" +
      "<span>" + roleLabelMap[role] + "认证入口</span>" +
      "</div>" +
      "</header>" +
      '<section class="auth-card' + (page === "register" && role === "admin" ? " is-notice" : "") + '">' +
      '<span class="page-tag">' + config.tag + "</span>" +
      "<h1>" + title + "</h1>" +
      '<p class="auth-copy">' + copy + "</p>" +
      '<nav class="identity-tabs" aria-label="身份选择">' + tabs + "</nav>" +
      content +
      buildFooter(page, role) +
      "</section></div>" +
      "</div>";

    attachInteractions();
  }

  render();
})();

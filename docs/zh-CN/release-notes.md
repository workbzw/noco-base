# 更新日志

## 2022/10/26 ~ v0.7.7-alpha.1

- fix(database/formula-field): when formula's field caculate result is 0 it alse will be save ([#962](https://github.com/nocobase/nocobase/issues/962))
- feat(file-manager): support tencent cos ([#958](https://github.com/nocobase/nocobase/issues/958))
- fix(plugin-workflow): fix constant schedule trigger time ([#956](https://github.com/nocobase/nocobase/issues/956))

## 2022/10/24 ~ v0.7.6-alpha.2

- Turkish language ([#939](https://github.com/nocobase/nocobase/issues/939))
- refactor(plugin-file-manager): move client code into plugin folder and enable path config ([#913](https://github.com/nocobase/nocobase/issues/913))
- feat: add filter action to collection table ([#953](https://github.com/nocobase/nocobase/issues/953))
- feat: ui schema cache ([#877](https://github.com/nocobase/nocobase/issues/877))
- feat: docker optimizing ([#948](https://github.com/nocobase/nocobase/issues/948))
- fix(plugin-workflow): test changedWithAssociations() ([#950](https://github.com/nocobase/nocobase/issues/950))
- fix(plugin-workflow): skip time based test ([#951](https://github.com/nocobase/nocobase/issues/951))
- fix(plugin-workflow): fix schedule trigger bug ([#949](https://github.com/nocobase/nocobase/issues/949))
- feat: changed with associations ([#943](https://github.com/nocobase/nocobase/issues/943))
- feat(useSignup): customize success message
- fix(plugin-workflow): fix collection fieldset component ([#942](https://github.com/nocobase/nocobase/issues/942))
- fix(plugin-workflow): avoid revision with ghost nodes ([#941](https://github.com/nocobase/nocobase/issues/941))
- fix(plugin-workflow): add req context to processor ([#936](https://github.com/nocobase/nocobase/issues/936))
- Feat/plugin workflow collection field ([#934](https://github.com/nocobase/nocobase/issues/934))
- fix(plugin-workflow): fix schedule infinitely trigger when repeat not set ([#926](https://github.com/nocobase/nocobase/issues/926))
- fix(plugin-workflow): temp disable validation of collection field in node ([#928](https://github.com/nocobase/nocobase/issues/928))

## 2022/10/16 ~ v0.7.5-alpha.1

- 优化关系字段的查询性能
- 添加手机号注册登录的支持
- 自动编码类型字段
- 新增日语、俄语翻译
- 页面布局支持拖拽调整列宽
- 修复若干 BUG

### Details

- feat: plugin workflow collection field ([#919](https://github.com/nocobase/nocobase/issues/919))
- fix(client/route-switch): skip sub routes
- feat: create with array of values ([#912](https://github.com/nocobase/nocobase/issues/912))
- fix: unbind on error throwing ([#914](https://github.com/nocobase/nocobase/issues/914))
- fix: appends merge now using primary key ([#911](https://github.com/nocobase/nocobase/issues/911))
- fix: cannot read properties of undefined (reading 'target')
- feat: limit database identifier ([#908](https://github.com/nocobase/nocobase/issues/908))
- fix: sync collection field default value ([#907](https://github.com/nocobase/nocobase/issues/907))
- fix: version judgment is not accurate
- fix(client): tab pane initializers for create form block
- fix: build error
- fix: appends merge includes ([#905](https://github.com/nocobase/nocobase/issues/905))
- fix: single relation repository appends query issue ([#901](https://github.com/nocobase/nocobase/issues/901))
- feat(plugin-workflow): add concat calculator (#894)
- feat: improve signin and signup page components
- fix(client/record-picker): support record-picker show format DataPicker (#888)
- fix(client/block-select-collection): fix select collection menu view error (#889)
- fix: unable to submit form during file upload (#892)
- feat(collection-manager): inverse fields can be configured (#883)
- fix(database): fix the index name too long error
- fix(formula): support integer and fix NaN error (#879)
- fix: sort parameter is missing (#849)
- fix: slow join query issued by appends field in find method of repository (#845)
- feat(core/cache): support cache (#876)
- feat: update option must have filter or filterByTk (#847)
- added Russian translation (#840)
- feat(database): add sequence field type (#779)
- fix: can't access pages without permission via url (#826)
- fix(collection-manger): incorrect scope key parameter
- fix: missing RefreshActionInitializer
- fix(collection-manager): o2m is array type
- fix(plugin-system-settings): convert array to json
- fix: transaction cannot be rolled back because it has been finished with state: rollback
- fix(plugin-export): filter non-existent fields
- refactor(resourcer): combine middleware class ([#825](https://github.com/nocobase/nocobase/issues/825))
- refactor(database): fix some fields and types ([#820](https://github.com/nocobase/nocobase/issues/820))
- feat: language settings support Japanese
- feat(locale): added Japanese translation ([#813](https://github.com/nocobase/nocobase/issues/813))
- fix(plugin-workflow): fix value type for DatePicker to moment ([#815](https://github.com/nocobase/nocobase/issues/815)) ([#819](https://github.com/nocobase/nocobase/issues/819))
- refactor(plugin-workflow): export client calculators registry ([#816](https://github.com/nocobase/nocobase/issues/816))
- fix: number storage type changed to double ([#810](https://github.com/nocobase/nocobase/issues/810))
- refactor(server) ([#795](https://github.com/nocobase/nocobase/issues/795))
- fix(plugin-verification): change provider rate limit error to 429 ([#788](https://github.com/nocobase/nocobase/issues/788))
- fix(plugin-cm): fix field disappear after failed to update ([#773](https://github.com/nocobase/nocobase/issues/773))
- fix: fix uiSchema undefined ([#770](https://github.com/nocobase/nocobase/issues/770))
- fix: translation
- fix(plugin-cm): fix unique option default value to update ([#768](https://github.com/nocobase/nocobase/issues/768))
- fix(plugin-users): fix update profile 500 ([#766](https://github.com/nocobase/nocobase/issues/766)) ([#767](https://github.com/nocobase/nocobase/issues/767))
- fix: mysql column in where clause is ambiguous ([#756](https://github.com/nocobase/nocobase/issues/756))
- feat(plugin-cm): add unique option for base fields ([#745](https://github.com/nocobase/nocobase/issues/745))
- feat(plugin-verification): add plugin-verification and phone for users ([#722](https://github.com/nocobase/nocobase/issues/722))
- feat: resize grid columns with drag and drop ([#748](https://github.com/nocobase/nocobase/issues/748))
- refactor(client): split schema-initializer items into multiple files ([#744](https://github.com/nocobase/nocobase/issues/744))
- refactor(plugin-workflow): change files mode to 644 ([#755](https://github.com/nocobase/nocobase/issues/755))
- fix: db version check ([#749](https://github.com/nocobase/nocobase/issues/749))
- feat: add examples ([#718](https://github.com/nocobase/nocobase/issues/718))

## 2022/08/15 ~ v0.7.4-alpha.7

### Details

- fix(collection-manager): update collection without fields

## 2022/08/12 ~ v0.7.4-alpha.4

### New features

- Field default value

### Details

- fix(database): error getting db version number
- fix: record provider required for read pretty
- fix: sync table sort to export (#723)
- feat: full version of the NocoBase dockerfile (#719)
- feat: add examples
- chore: update node ci
- fix(plugin-workflow): fix extend collection (#708)
- fix: DB_TABLE_PREFIX doesn't get applied (#710)
- feat: default value (#679)
- fix: required field delete submit error (#688) (#694)

## 2022/07/28 ~ v0.7.4-alpha.1

### Details

- fix: append roles to current user (#695)
- fix(client): required for the sub-table field
- fix: date format (#686)
- test(plugin-workflow): skip prompt tests (#692)
- fix: accuracy of percent (#685)
- fix: the database only supports MySQL 8.0.17 and above, SQLite 3.x and PostgreSQL 10+
- fix(plugin-workflow): adjust await sleep time for test cases (#691)
- feat(plugin-workflow): add assignees config for prompt instruction (#690)
- fix: role export button display (#616) (#666)
- fix: uid validate (#681)
- feat(client): tab icon
- fix(plugin-error-handler): no error message
- fix(client): fieldNames of RecordPicker
- fix: hide password
- refactor: replace react-drag-listview with @dnd-kit/sortable (#660)
- refactor(plugin-users): improve extendibility of middlewares (#677)
- feat: o2m delete not refresh (#646)
- feat: kanban add description (#659)
- fix: field loss enum (#667)
- feat: add ui editor hot key Ctrl+Shift+U (#675)
- fix: calendar change field error (#626) (#671)
- chore: fix eslint not work (#670)
- feat: number precision (#661)
- feat: nginx config (#664)
- feat: form item designer form switch issue (#656)
- fix: wrong operator

## 2022/07/20 ~ v0.7.3-alpha.1

### New features

- Form validation
- Actions: Print, Refresh

### Details

- fix(client): hide modal header
- feat: customizable jwt expiration date
- feat: print action (#652)
- feat: restore action-hooks (#655)
- feat: collections & fields pagination issue (#653)
- fix(core): change proxied agent methods to native (#654)
- feat: remove table field details actions (#638)
- fix: link to default value (#641)
- fix(client): build error
- fix: localStorage is not defined
- feat: support for displaying relational table fields in details or form blocks (#635)
- fix: record picker cannot select from different pages (#623)
- feat(client): plugin toolbar icons and translations
- fix: dragging an element to the left, right, or bottom would cause the element to disappear (#620)
- feat: table action add reload button (#630)
- feat: improve language settings (#627)
- feat: field assignment for custom actions supports string variables (#597)
- fix(client): blocks are deleted when they are dragged below the current block
- fix: skip recursive remove on grid component (#621)
- feat: fix time and collection pagination (#618)
- feat: recordblockinitializers fields pick (#558)
- fix: incorrectly :active background (#607)
- fix: obo table selector (#613)
- feat: form validator (#569)
- fix: table selector (#612)

## 2022/07/07 ~ v0.7.2-alpha.2

- fix(g2plot): import all plots
- fix: field permissions cannot be saved (#605)
- fix(plugin-workflow): fix revision bug (#603)
- fix(plugin-workflow): fix select value (#600)
- fix(plugin-workflow): fix CollectionFieldSelect component (#598)
- feat(plugin-workflow): add association select in calculation (#584)
- feat: function for chart data request
- fix(cli): remove process.env.NODE_OPTIONS

## 2022/07/05 ~ v0.7.2-alpha.1

### New features

- Fields: 整数字段
- Blocks: 支持在区块里显示关系表的字段
- Plugins: 筛选条件支持变量

### Breaking changes

- 新版本关系默认不建立外键约束，旧版本升级后会删除掉所有已创建的外键约束
- 之前使用 yarn create 安装的 NocoBase 应用，需要重新 yarn create，再执行 `yarn nocobase upgrade --raw`

### Details

- fix: drop all foreign keys (#576)
- fix(plugin-workflow): fix collection trigger config (#575)
- fix: improve filter item styling
- fix(collection-manager): missing collection manager context
- feat: filter with variable (#574)
- feat(cli): check database version before installation (#572)
- fix(client): comment out useless code
- fix(cli): app start before sync and upgrade
- feat(client): integer field
- fix(database): index invalid (#564)
- fix: export association table data (#561)
- fix(client): maximum call stack size exceeded (#554)
- refactor(plugin-workflow): move client files into plugin (#556)
- fix(database): constraints default to false (#550)
- fix(client): cannot read properties of undefined (reading 'split')
- fix(workflow): merge workflow providers
- fix(workflow): load workflow after application initialization
- fix(plugin-workflow): fix select width (#552)
- feat: compatible with old kanban (#553)
- fix(client): consider explicitly re-exporting to resolve the ambiguity
- feat: display association fields (#512)
- Fix(plugin workflow) (#549)
- fix: update mysql port (#548)
- fix: export of relation blocks (#546)
- fix(plugin-workflow): clear options when change collection (#547)
- feat(plugin-workflow): add race mode (#542)
- fix(client): change toArr to _.castArray in select component (#543)

## 2022/06/26 ~ v0.7.1-alpha.7

### New features

- Fields: 公式、表关系(o2o, o2m, m2o, m2m)
- Blocks: 图表(g2plot)
- Plugins: 操作记录, 导出, 工作流(定时任务)

### Breaking changes

- 百分比字段存储原始数值。 比如，旧版本将 1% 存储为  1，新版本将 1%  存储为 0.01
- 去掉子表格字段，并使用一对多字段代替
- 如果之前是使用 yarn create 安装的 NocoBase 应用，需要重新 yarn create，再执行 yarn nocobase upgrade

### Details

- fix(cli): upgrade from docker
- chore(create-nocobase-app): fix some bugs (#538)
- feat: relationship fields are loaded on demand
- fix: destroy collection fields (#536)
- feat(plugin-workflow): add delay node type (#532)
- refactor: client application (#533)
- fix: missing transaction (#531)
- fix: add ellipsis property to record picker (#527)
- fix: remove pattern without form item (#528)
- fix(client): update only fields in the form
- fix(client): remove z-index
- fix(plugin-workflow): set current when update (#526)
- fix(client): non-empty judgment
- fix: order nulls last (#519)
- fix(client): close the pop-up after request
- fix: action loading, refresh context, form submit and validate (#523)
- fix: field pattern (#520)
- fix(plugin-workflow): fix searchable select min-width (#524)
- fix: template with fields only (#517)
- fix(plugin-workflow): fix update workflow current property (#521)
- feat: improve chart component
- refactor(plugin-workflow): abstract to classes (#515)
- feat: column sortable and form item pattern (#518)
- feat(client): display option value
- feat(client): hide drawer header
- fix(audit-logs): operator does not exist: character varying = integer
- fix(custom-request): support string/json templates (#514)
- fix(cli): missing await
- feat: add block title (#513)
- fix: remove collections & fields from db (#511)
- fix(cli): upgrade error in node v14
- feat: improve migrations (#510)
- fix(client): improve datepicker component, date with time zone, gmt support
- fix: datepicker with timezone
- fix(client): consolidate usage of date/time as UTC in transfering (#509)
- fix: formula bug
- fix: default exportable fields (#506)
- fix(audit-logs): sort by createdAt
- fix(plugin-export): allow to configure in acl
- fix: sign in/sign up with enter key
- fix(client): percent precision
- feat: association field block (#493)
- feat: plugin export (#479)
- fix: create or delete collection error (#501)
- feat: update collections & fields (#500)
- fix: rollback when field creation fails (#498)
- fix(client): set `dropdownMatchSelectWidth` to false globally (#497)
- fix(client): no-key warning in user menu items (#496)
- Feat(plugin workflow): cron field for schedule trigger configuration (#495)
- feat: audit logs (#494)
- fix(client): language settings
- feat(client): improve locale
- refactor(plugin-workflow): add revision column to execution (#491)
- fix(plugin-multi-app-manager): fix pg cannot create database block tests
- refactor(database): hook proxy (#402) 
- feat: chart blocks (#484) 
- refactor(plugin workflow): support number in repeat config for schedule
- chore(debug): add debug config (#475)
- fix: has one bug 
- feat: relationships (#473) 
- fix(plugin-workflow): fix collection trigger transaction (#474)
- fix(plugin-workflow): temporary solution for collection trigger conditions
- fix: markdown component (#469)
- fix: formula field and percent field (#467) 
- fix(plugin-workflow): fix update workflow action (#464)
- fix(acl): skip when field does not exist
- fix: update formula field and percent field (#461)
- fix(client): export useSignin and useSignup
- fix(ci): node_version = 14
- fix(cli): yarn install --production error
- fix(client): build error
- feat: add formula field type (#457) 
- fix: the details of the associated data in the subtable are not displayed
- fix(plugin-workflow): fix languages (#451) 
- fix: afterSync hook not triggered (#450)

## 2022/06/01 ~ v0.7.0-alpha.83

- fix: default value of time zone
- fix(database): add timezone support
- docs(various): Improve readability (#447) 
- fix(client): datetime with timezone
- feat(plugin-file-manager): record the creator of the attachment
- feat: custom request (#439)
- feat(plugin workflow): schedule trigger (#438) 
- feat(database): db migrator (#432) 
- fix(client): select component cannot be opened in sub-table block (#431)
- fix: error message "error:0308010C:digital envelope routines::unsupported
- docs(github): change to markdown format (#430)
- fix(cli): typo (#429)

### New Features

- Core: db migrator

## 2022/05/26 ~ v0.7.0-alpha.82

- feat(client,sdk): improve api client

### Breaking changes

There are major changes to the `APIClient` API, see details [JavaScript SDK](./development/http-api/javascript-sdk.md)

## 2022/05/25 ~ v0.7.0-alpha.81

- feat: add create-plugin command (#423)
- fix: "typescript": "4.5.5"
- docs: update documentation
- fix(client): filter menu item schema by permissions
- fix(database): cannot read properties of null (reading 'substring')
- fix(client): add description
- fix(client): clone schema before insert
- feat(client): add a description to the junction collection field
- fix(devtools): unexpected token '.'

## 2022/05/24 ~ v0.7.0-alpha.78

- fix(client): add RemoteDocumentTitleProvider
- fix(client): incomplete calendar events
- fix(plugin-users): add translations (#416)

## 2022/05/23 ~ v0.7.0-alpha.62

- feat(docs): add alert message
- fix(create-nocobase-app): storage path error
- fix(client): improve translation
- fix(cli): nocobase test command --db-clean option is invalid
- refactor(plugin-workflow): change column type of executed from boolean to integer (#411)

## 2022/05/22 ~ v0.7.0-alpha.58

- fix: 204 no content response (#378)
- feat: destroy association field after target collection destroy (#376)
- fix(type): use sequelize native Transactionable instead of TransactionAble (#410)
- fix(plugin-workflow): remove previous listeners when collection changed in config (#409)
- fix(plugin-acl): missing pagination parameters (#394)
- feat(client): add custom action (#396)
- refactor(plugin-workflow): multiple instances and event management (fix #384) (#408)
- feat(cli): --db-sync options
- fix(client): pagination dropdown menu is blocked (#398)
- feat: display version number (#386)
- fix: missing isTruly/isFalsy filter operators (#390)
- fix(client): reset page number to first page (#399)

## 2022/05/19 ~ v0.7.0-alpha.57

### 新功能

- 打包工具 `@nocobase/build`
- cli 工具 `@nocobase/cli`
- devtools 包 `@nocobase/devtools`
- JavaScript 版本的 SDK `@nocobase/sdk`
- 全新的文档（v0.7）

### 问题修复和改进

- 将 NocoBase 无代码平台插件放到一起 `@nocobase/preset-nocobase`
- 改进 create 脚手架 `create-nocobase-app`
- 官网文档主题 `dumi-theme-nocobase`

### Breaking changes

📢 在此之前创建的项目需要重新创建。

## 2022/05/14 ~ v0.7.0-alpha.34

- feat: add plugins:getPinned action api
- Fix(plugin workflow): fix cannot get job result properties (#382)
- feat: exist on server start throw error (#374)
- chore: application options (#375)
- fix: not in operator with null value record (#377)

## 2022/05/13 ~ v0.7.0-alpha.33

- fix: link-to field data scope error  (#1337)
- feat(plugin workflow): revisions (#379)
- fix(database): fix option-parser include list index (#371)
- fix(plugin-workflow): fix duplicated description in fields values (#368)
- fix(database): fix type and transaction in repository (#366)
- fix(plugin workflow): fix transaction of execution (#364)

## 2022/05/05 ~ v0.7.0-alpha.30

- fix(client): upgrade formily packages
- fix(client): setFormValueChanged must be defined

## 2022/05/01 ~ v0.7.0-alpha.27

- fix: use wrapper when greater than one column
- fix: props for CreateFormBlockInitializers
- fix: add schema initializer icon
- fix: plugin workflow (#349)
- fix: db:sync not working (#348)
- fix(plugin-workflow): fix trigger bind logic to avoid duplication (#347)
- Fix(plugin workflow) (#346)
- fix: action open mode
- Fix: menu url style (#344)
- feat: action loading
- fix: compile the label field
- fix: invalid drag and drop sort

## 2022/04/25 ~ v0.7.0-alpha.16

- fix: cannot find module mkdirp (#330)
- Fix(plugin workflow): UX issues (#329)
- fix(plugin-file-manager): test failed
- fix(app-server): dist options

## 2022/04/25 ~ v0.7.0-alpha.0

- 内测版

## 2021/10/07 ~ v0.5.0

- 第二个预览版

## 2021/04/07 ~ v0.4.0

- 第一个预览版

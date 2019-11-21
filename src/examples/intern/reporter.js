const style = document.createElement('style');
style.innerHTML = `
html,
body {
	background: white !important;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
	font-weight: normal !important;
}

.internReportContainer {
	margin-top: 40px !important;
}

.testResult {
	display: table-row !important;
}

.testResult .skipped,
.summary,
.reportHeader,
.reportControls,
.testStatus:before,
tr td:first-child,
tr td:nth-child(4) {
	display: none !important;
}

.report .suite td.title {
	font-weight: normal !important;
}

tr.testResult.passed {
	background: #ecf9ec !important;
}

.testResult .column-info {
	unicode-bidi: embed;
	font-family: monospace;
	white-space: pre-wrap;
}
`;
document.head.appendChild(style);

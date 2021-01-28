import { css } from 'lit-element/lit-element';

export const d2lTableStyles = css`
table {
	background-color: transparent;
	border: 1px solid #cdd5dc;
	border-collapse: collapse;
	border-color: var(--d2l-color-mica);
	border-radius: 0.3rem;
	border-spacing: 0;
	font-size: 0.8rem;
	font-weight: 400;
	height: 41px;
	width: 100%;
}

td, th {
	background-color: #ffffff;
	border: 1px solid #cdd5dc;
	height: 41px;
	padding: 0.5rem 1rem;
	vertical-align: middle;
}

th {
	background-color: #f9fbff;
	font-size: 0.7rem;
	line-height: 1rem;
	margin: 1rem 0;
	text-align: left;
}

:host([dir="rtl"]) th {
	text-align: right;
}

table thead > tr:first-child {
	border-left-style: none;
	border-top-style: none;
}
`;

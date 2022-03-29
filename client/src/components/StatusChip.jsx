import { Chip } from "@mui/material";

function StatusChip(props) {
  let chipColor;

  switch (props.status) {
    case "closed":
        chipColor = 'error'
      break;
    case "pending":
        chipColor = 'warning'
      break;
    case "processing":
        chipColor = 'success'
      break;

    default:
      break;
  }
  return <Chip  color={chipColor} label={props.status.charAt(0).toUpperCase() + props.status.slice(1)}/>;
}

export default StatusChip;

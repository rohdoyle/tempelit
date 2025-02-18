import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";
import Looks5OutlinedIcon from "@mui/icons-material/Looks5Outlined";
import Looks6OutlinedIcon from "@mui/icons-material/Looks6Outlined";

const stepIcons = [
  <LooksOneOutlinedIcon key="step1-icon" fontSize="large" />,
  <LooksTwoOutlinedIcon key="step2-icon" fontSize="large" />,
  <Looks3OutlinedIcon key="step3-icon" fontSize="large" />,
  <Looks4OutlinedIcon key="step4-icon" fontSize="large" />,
  <Looks5OutlinedIcon key="step5-icon" fontSize="large" />,
  <Looks6OutlinedIcon key="step6-icon" fontSize="large" />,
];

const TutorialModal = ({ open, handleClose, data }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isLangFa = lang === "fa";
  const dir = isLangFa ? "rtl" : "ltr";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        direction: dir,
        borderRadius: "16px",
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#000000a8",
        }}
      >
        {data?.faTitle ? (isLangFa ? data?.faTitle : data?.title) : data?.title}
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "#000000a8",
        }}
      >
        {/* Render the tutorial steps if they exist */}
        {data?.tutorialSteps?.length > 0 ? (
          <Box mt={3}>
            <Typography variant="h6">{t("tutorialTitle")}</Typography>
            {data.tutorialSteps.map((step, index) => (
              <Box key={index} mt={2} display="flex" alignItems="center">
                {stepIcons[index] || <LooksOneOutlinedIcon />}
                <Box ml={1}>
                  <Typography variant="subtitle1">
                    {isLangFa ? step.faStepText : step.stepText}
                  </Typography>
                  {step?.stepImage && (
                    <img
                      src={step.stepImage}
                      alt={`Step ${index + 1}`}
                      width="100%"
                      style={{ marginTop: 10 }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>{t("noTutorial")}</Typography>
        )}

        {data?.videoLink && (
          <iframe
            width="100%"
            height="315"
            src={data.videoLink}
            title={data.title}
            frameBorder="0"
            allowFullScreen
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

TutorialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    faTitle: PropTypes.string,
    videoLink: PropTypes.string,
    tutorialSteps: PropTypes.arrayOf(
      PropTypes.shape({
        stepText: PropTypes.string,
        faStepText: PropTypes.string,
        stepImage: PropTypes.string,
      })
    ),
  }),
};

export default TutorialModal;

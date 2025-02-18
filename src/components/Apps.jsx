import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import errorLogo from "../assets/vite.svg";
import { AdUnits, Checklist } from "@mui/icons-material";
import TutorialModal from "./TutorialModal";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import CodeIcon from "@mui/icons-material/Code";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";

const getButtonStyles = (type, theme) => {
  switch (type) {
    case "download":
      return {
        backgroundColor:
          theme === "dark"
            ? "rgba(30, 144, 255, 0.5)"
            : "rgba(35, 103, 181, 0.8)",
        color: "#fff",
      };
    case "configuration":
      return {
        backgroundColor:
          theme === "dark"
            ? "rgba(76, 175, 80, 0.5)"
            : "rgba(78, 191, 119, 0.8)",
        color: "#fff",
      };
    case "watchVideo":
      return {
        backgroundColor:
          theme === "dark"
            ? "rgba(255, 193, 7, 0.5)"
            : "rgba(255, 208, 75, 0.8)",
        color: "#000",
      };
    default:
      return {
        backgroundColor:
          theme === "dark"
            ? "rgba(255, 87, 34, 0.5)"
            : "rgba(255, 87, 34, 0.8)",
        color: "#fff",
      };
  }
};

const getOsIcon = (osName) => {
  const icons = {
    Windows: <DesktopWindowsOutlinedIcon fontSize="large" />,
    Android: <AndroidIcon fontSize="large" />,
    iOS: <AppleIcon fontSize="large" />,
    Linux: <CodeIcon fontSize="large" />,
    default: <CancelPresentationOutlinedIcon fontSize="large" />,
  };
  return icons[osName] || icons.default;
};

const getAccordionStyles = (theme) => ({
  marginBottom: ".8rem",
  background:
    theme === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
  color: theme.colors.BWColorRevert.light,
  "&.Mui-expanded": {
    background:
      theme === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.3)",
  },
});

const renderButtonGrid = (
  icon,
  label,
  theme,
  t,
  link,
  app,
  handleModalOpen,
  shadowrocket
) => {
  if (label === "watchVideo") {
    return (
      <Grid
        item
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={0.5}
        width={"100%"}
        sx={{
          ...getButtonStyles(label, theme),
          borderRadius: "1rem",
          padding: 1,
          cursor: "pointer",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.4)",
          },
        }}
        onClick={() => handleModalOpen(app)}
      >
        {icon}
        <Typography fontSize={"smaller"} textAlign={"center"} noWrap>
          {t(label)}
        </Typography>
      </Grid>
    );
  }

  const openShadowrocketURL = (subLink) => {
    const encodedURL = btoa(subLink);
    const shadowrocketLink = "sub://" + encodedURL;
    window.location.href = shadowrocketLink; // Redirect to the Shadowrocket link
  };

  return (
    <Grid
      item
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={0.5}
      width={"100%"}
      sx={{
        ...getButtonStyles(label, theme),
        borderRadius: "1rem",
        padding: 1,
        cursor: "pointer",
        textDecoration: "none",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.4)",
        },
      }}
      component={shadowrocket ? "div" : "a"}
      target={!shadowrocket ? "_blank" : ""}
      href={!shadowrocket ? link : ""}
      onClick={
        shadowrocket ? () => openShadowrocketURL(shadowrocket) : undefined
      }
    >
      {icon}
      <Typography fontSize={"smaller"} textAlign={"center"} noWrap>
        {t(label)}
      </Typography>
    </Grid>
  );
};

const renderAppAccordion = (
  app,
  index,
  lang,
  theme,
  t,
  subLink,
  handleModalOpen
) => {
  return (
    <Accordion key={index} sx={getAccordionStyles(theme)}>
      <AccordionSummary
        expandIcon={
          <ArrowDropDownIcon
            sx={{ color: theme.colors.BWColorRevert[theme.palette.mode] }}
          />
        }
        aria-controls={`panel-${app.name}-content`}
        id={`panel-${app.name}-header`}
      >
        <Grid container alignItems="center" justifyContent="space-around">
          <Grid
            item
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              src={app.logo}
              alt={`${app.name} logo`}
              style={{ width: "30px", height: "auto", borderRadius: "20%" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = errorLogo;
              }}
            />
          </Grid>
          <Grid
            item
            xs={10}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>{app.name}</Typography>
            <Button
              variant="contained"
              color="textSecondary"
              sx={{
                borderRadius: "50px",
                backgroundColor:
                  app?.price === "0"
                    ? theme.colors.apps.priceBtn.free.btn[theme.palette.mode]
                    : app?.isAd
                    ? theme.colors.apps.priceBtn.ad.btn[theme.palette.mode]
                    : theme.colors.apps.priceBtn.paid.btn[theme.palette.mode],
                color:
                  app?.price === "0"
                    ? theme.colors.apps.priceBtn.free.text[theme.palette.mode]
                    : app?.isAd
                    ? theme.colors.apps.priceBtn.ad.text[theme.palette.mode]
                    : theme.colors.apps.priceBtn.paid.text[theme.palette.mode],
                textTransform: "capitalize",
                boxShadow: "0 0 3px 0px #99bbaf",
              }}
            >
              {app.price === "0"
                ? t("free")
                : app?.isAd
                ? t("ad")
                : `${app.price} $`}
            </Button>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column" gap={".7rem"} alignItems={"center"}>
          <Typography sx={{ paddingBottom: "1rem" }}>
            {lang === "fa" ? app.faDescription : app.description}
          </Typography>
          {app.downloadLink &&
            !app?.isAd &&
            renderButtonGrid(
              <ArrowCircleDownIcon fontSize="medium" />,
              "download",
              theme,
              t,
              app.downloadLink
            )}
          {app?.isAd &&
            renderButtonGrid(
              <AdUnits fontSize="medium" />,
              app.adBtnText,
              theme,
              t,
              app.downloadLink
            )}
          {app.configLink &&
            renderButtonGrid(
              <AddCircleOutlineIcon fontSize="medium" />,
              "configuration",
              theme,
              t,
              app.configLink.replace("{url}", subLink),
              null,
              null,
              app.name === "Shadowrocket" ? subLink : null
            )}
          {app.tutorialSteps?.length > 0 &&
            renderButtonGrid(
              <PlayCircleFilledWhiteOutlinedIcon fontSize="medium" />,
              "watchVideo",
              theme,
              t,
              null,
              app,
              handleModalOpen
            )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

const Apps = ({ subLink }) => {
  const { t, i18n } = useTranslation();
  const [operatingSystems, setOperatingSystems] = useState([]);
  const lang = i18n.language;
  const theme = useTheme();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleModalOpen = (app) => {
    setModalData({
      title: app.name,
      videoLink: app.videoLink,
      tutorialSteps: app.tutorialSteps,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    fetch(
      import.meta.env.VITE_JSON_APPS_URL ||
        "https://raw.githubusercontent.com/MatinDehghanian/public-assets/refs/heads/main/json/os.json"
    )
      .then((response) => response.json())
      .then((data) => setOperatingSystems(data.operatingSystems));
  }, []);

  return (
    <>
      <Grid
        justifyContent="space-between"
        sx={{ paddingY: "1rem" }}
        xs={11}
        item
      >
        <Accordion
          sx={{
            direction: lang === "fa" ? "rtl" : "ltr",
            background: theme.colors.apps[theme.palette.mode],
            borderRadius: "16px",
            paddingY: ".4rem",
            color: "#fff",
            border: theme === "light" ? "" : "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDropDownIcon fontSize="large" sx={{ color: "#fff" }} />
            }
            aria-controls="panel-os-content"
            id="panel-os-header"
          >
            <Grid container alignItems="center" justifyContent={"space-around"}>
              <Grid item xs={1} display="flex" justifyContent="center">
                <Checklist
                  fontSize="large"
                  sx={{
                    marginInlineStart: "1rem",
                    background: "#fff",
                    padding: 0.4,
                    borderRadius: "10px",
                    color: theme.colors.apps.light,
                  }}
                />
              </Grid>
              <Grid item xs={10} display="flex" justifyContent="center">
                <Typography>{t("operatingSystems")}</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {operatingSystems.map((os, index) => (
              <Accordion key={index} sx={getAccordionStyles(theme)}>
                <AccordionSummary
                  expandIcon={
                    <ArrowDropDownIcon
                      sx={{
                        color: theme.colors.BWColorRevert.light,
                      }}
                    />
                  }
                  aria-controls={`panel-${os.name}-content`}
                  id={`panel-${os.name}-header`}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={1} display="flex" justifyContent="center">
                      {getOsIcon(os.engName)}
                    </Grid>
                    <Grid item xs={10} display="flex" justifyContent="center">
                      <Typography>
                        {lang === "fa" ? os.name : os.engName}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  {os.apps.map((app, appIndex) =>
                    renderAppAccordion(
                      app,
                      appIndex,
                      lang,
                      theme,
                      t,
                      subLink,
                      handleModalOpen
                    )
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      </Grid>
      <TutorialModal
        open={modalOpen}
        handleClose={handleModalClose}
        data={modalData}
      />
    </>
  );
};
Apps.propTypes = {
  subLink: PropTypes.string,
};

export default Apps;

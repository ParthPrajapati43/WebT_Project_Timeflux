import React from "react";
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { bounce } from "react-animations";
import Aos from "aos";
import "aos/dist/aos.css";
import VideoSharing from "./images/VideoSharing.png";
import logo from "./images/Timeflux.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignInAlt,
  faUserCheck,
  faChevronDown,
  faAddressCard,
  faEdit,
  faPaperPlane,
  faTrashAlt,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import CallIcon from "@material-ui/icons/Call";
import EmailIcon from "@material-ui/icons/Email";
import ParthImg from "./images/ParthPrajapati.jpg";
import NisargDImg from "./images/NisargDave.jpeg";
import NisargKImg from "./images/NisargKapkar.jpeg";
import NeevImg from "./images/NeevShah.jpeg";
import "./Info.css";

function Info() {
  const Bounce = styled.div`
    animation: 6s ${keyframes`${bounce}`} 1;
  `;

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

  const classes = useStyles();
  const classess = makeStyles({
    root: {
      maxWidth: 345,
    },
  });
  const classesss = makeStyles((theme) => ({
    root: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
  }));

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className="grids">
      <div data-aos="zoom-in" className="boxes">
        <div className="box__info">
          <div className="timeflux__info">
            <img className="logo__img" src={logo} alt="timeflux logo" />
            <br />
            <h2 className="tagline">
              One of the Best Platform
              <br />
              to explore Slow Mo and Time Lapse Videos
              <br />
              <br />
              SignUp to join us in this beautiful Journey
              <br />
            </h2>
          </div>
          <div className="timeflux__videoshare">
            <h1>Welcome</h1>
            <br />
            <img
              className="videoshare__img"
              src={VideoSharing}
              alt="timeflux Video Sharing"
            />
          </div>
        </div>
      </div>
      <div data-aos="zoom-in" className="boxes">
        <div className="box__info">
          <div className="timeflux__fimg">
            <h1>Features</h1>
            <br />
            <br />
            <img
              className="videoshare__img"
              src={VideoSharing}
              alt="timeflux features"
            />
          </div>
          <div className="timeflux__features">
            <Bounce>
              <span>
                <FontAwesomeIcon className="icon" icon={faUserPlus} size="2x" />
                <h2>&nbsp;&nbsp;SignUp to TimeFlux</h2>
              </span>
              <span>
                <FontAwesomeIcon
                  className="icon"
                  icon={faSignInAlt}
                  size="2x"
                />
                <h2>&nbsp;&nbsp;SignIn/LogOut anytime</h2>
              </span>
              <span>
                <FontAwesomeIcon
                  className="icon"
                  icon={faUserCheck}
                  size="2x"
                />
                <h2>&nbsp;&nbsp;Firebase based Authentication</h2>
              </span>
              <span>
                <FontAwesomeIcon
                  className="icon"
                  icon={faAddressCard}
                  size="2x"
                />
                <h2>&nbsp;&nbsp;Setup Your Profile</h2>
              </span>
              <span>
                <FontAwesomeIcon className="icon" icon={faEdit} size="2x" />
                <h2>&nbsp;&nbsp;Editing Profile anytime</h2>
              </span>
              <span>
                <FontAwesomeIcon className="icon" icon={faVideo} size="2x" />
                <h2>&nbsp;&nbsp;Slow Mo/Time Lapse Sharing</h2>
              </span>
              <span>
                <FontAwesomeIcon className="icon" icon={faTrashAlt} size="2x" />
                <h2>&nbsp;&nbsp;Deleting Post anytime</h2>
              </span>
              <span>
                <FontAwesomeIcon
                  className="icon"
                  icon={faPaperPlane}
                  size="2x"
                />
                <h2>&nbsp;&nbsp;Commenting on Post</h2>
              </span>
            </Bounce>
          </div>
        </div>
      </div>
      <div data-aos="zoom-in" className="boxes">
        <div className="box__info">
          <div className="timeflux__info">
            <Accordion>
              <AccordionSummary
                expandIcon={
                  <FontAwesomeIcon
                    className="icon"
                    icon={faChevronDown}
                    size="1x"
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  <b>Which Framework is used to build this project?</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <b>React</b>: It is an open-source, front end, JavaScript
                  library for building user interfaces or UI components.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={
                  <FontAwesomeIcon
                    className="icon"
                    icon={faChevronDown}
                    size="1x"
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  <b>
                    Which Database Server is used for automatic data
                    synchronization, user authentication and file storage?
                  </b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <b>Firebase</b>: It is a Backend-as-a-Service — BaaS — that
                  started as a YC11 startup and grew up into a next-generation
                  app-development platform on Google Cloud Platform.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={
                  <FontAwesomeIcon
                    className="icon"
                    icon={faChevronDown}
                    size="1x"
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  <b>
                    What libraries and toolkits are used for designing the
                    frontend of this project?
                  </b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <b>Material-UI</b> (for widgets like Buttons, TextFields,
                  Modals, etc.)
                  <br />
                  <b>Font Awesome</b> (for icons like Home, SignIn/Logout,
                  Upload, etc.)
                  <br />
                  <b>Animate on Scroll(AoS)</b> (for on scroll animations)
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="timeflux__videoshare">
            <h1>Frequently Asked Questions</h1>
            <br />
            <img
              className="videoshare__img"
              src={VideoSharing}
              alt="timeflux Video Sharing"
            />
          </div>
        </div>
      </div>
      <div data-aos="zoom-in" className="boxes">
        <div className="creater__info">
          <h1>About the Developers</h1>
          <br />
          <div className="card__div">
            <div className="creater__card">
              <Card className={classess.root}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="Parth Prajapati"
                    height="240px"
                    image={ParthImg}
                    title="Parth Prajapati"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Parth Prajapati
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      18BCP076
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <a href="tel:+919662256424" target="_blank">
                    <Button size="small" color="primary">
                      <CallIcon />
                    </Button>
                  </a>
                  <a href="mailto:parthy4399@gmail.com" target="_blank">
                    <Button size="small" color="primary">
                      <EmailIcon />
                    </Button>
                  </a>
                  <a href="https://github.com/ParthPrajapati43" target="_blank">
                    <Button size="small" color="primary">
                      <GitHubIcon />
                    </Button>
                  </a>
                  <a
                    href="https://www.instagram.com/parth.4399/"
                    target="_blank"
                  >
                    <Button size="small" color="primary">
                      <InstagramIcon />
                    </Button>
                  </a>
                </CardActions>
              </Card>
            </div>
            <div className="creater__card">
              <Card className={classess.root}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="Neev Shah"
                    height="240px"
                    image={NeevImg}
                    title="Neev Shah"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Neev Shah
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      18BCP067
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <a href="tel:+919512015166" target="_blank">
                    <Button size="small" color="primary">
                      <CallIcon />
                    </Button>
                  </a>
                  <a href="mailto:neevshah1273@gmail.com" target="_blank">
                    <Button size="small" color="primary">
                      <EmailIcon />
                    </Button>
                  </a>
                  <a href="https://github.com/neevshah1273" target="_blank">
                    <Button size="small" color="primary">
                      <GitHubIcon />
                    </Button>
                  </a>
                  <a href="https://www.instagram.com/neev.3/" target="_blank">
                    <Button size="small" color="primary">
                      <InstagramIcon />
                    </Button>
                  </a>
                </CardActions>
              </Card>
            </div>
            <div className="creater__card">
              <Card className={classess.root}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="Nisarg Dave"
                    height="240px"
                    image={NisargDImg}
                    title="Nisarg Dave"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Nisarg Dave
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      18BCP070
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <a href="tel:+919662714493" target="_blank">
                    <Button size="small" color="primary">
                      <CallIcon />
                    </Button>
                  </a>
                  <a href="mailto:nisargdave7324@gmail.com" target="_blank">
                    <Button size="small" color="primary">
                      <EmailIcon />
                    </Button>
                  </a>
                  <a href="https://github.com/Nisarg7324" target="_blank">
                    <Button size="small" color="primary">
                      <GitHubIcon />
                    </Button>
                  </a>
                  <a
                    href="https://www.instagram.com/nisarg_dave7/"
                    target="_blank"
                  >
                    <Button size="small" color="primary">
                      <InstagramIcon />
                    </Button>
                  </a>
                </CardActions>
              </Card>
            </div>
            <div className="creater__card">
              <Card className={classess.root}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="Nisarg Kapkar"
                    height="240px"
                    image={NisargKImg}
                    title="Nisarg Kapkar"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Nisarg Kapkar
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      18BCP069
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <a href="tel:+917435032256" target="_blank">
                    <Button size="small" color="primary">
                      <CallIcon />
                    </Button>
                  </a>
                  <a href="mailto:nisargkapkar00@gmail.com" target="_blank">
                    <Button size="small" color="primary">
                      <EmailIcon />
                    </Button>
                  </a>
                  <a href="https://github.com/Nkap23" target="_blank">
                    <Button size="small" color="primary">
                      <GitHubIcon />
                    </Button>
                  </a>
                  <a
                    href="https://www.instagram.com/nisarg_kapkar/"
                    target="_blank"
                  >
                    <Button size="small" color="primary">
                      <InstagramIcon />
                    </Button>
                  </a>
                </CardActions>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;

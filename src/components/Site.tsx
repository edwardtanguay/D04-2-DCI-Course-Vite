import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "../styles/reset.scss";
import "../styles/site.scss";

import PageSchedule from "./PageSchedule";
import { PageEdward } from "./PageEdward";
import { PageMehmet } from "./PageMehmet";
import { PageMarc } from "./PageMarc";

function Site() {
    return (
        <BrowserRouter>
            <div className="app_site">
                <div className="topHeader">
                    <h1 className="siteTitle">D04-2 Course</h1>
                </div>
                <nav className="main">
                    <span>
                        <Link to="/">Home</Link>
                    </span>
                    <span>
                        <Link to="/edward">Edward</Link>
                    </span>
                    <span>
                        <Link to="/marc">Marc</Link>
                    </span>
          <span>
            <Link to="/mehmet">Mehmet</Link>
          </span>
                </nav>

                <section className="app_container">
                    <div className="siteMessage"></div>
                    <Switch>
                        <Route exact path="/">
                            {" "}
                            <PageSchedule />
                        </Route>
                        <Route path="/edward">
                            <PageEdward />
                        </Route>
                        <Route path="/marc">
                            <PageMarc />
                        </Route>
            <Route path="/mehmet">
              <PageMehmet />
            </Route>
                    </Switch>
                </section>
            </div>
        </BrowserRouter>
    );

}

export default Site;

package chess.webapp

import scala.scalajs.js.JSApp
import org.scalajs.jquery.jQuery
import scala.scalajs.js.annotation.JSExport

object ChessApp extends JSApp {
  def main(): Unit = {
    jQuery(setupUI _)
  }

  def setupUI(): Unit = {
    jQuery("body").append("<h1>Chess</h1>")
    jQuery("body")
      .append("<canvas id='chess'></canvas>")
    // jQuery("#clickMe").click(addClickedMessage _)

    draw(jQuery("#chess"))
  }

  def draw(element): Unit = {
    val element = jQuery("#chess")
    println(element)
  }

  def addClickedMessage(): Unit = {
    jQuery("body").append("<p>You clicked the button!</p>")
  }
}
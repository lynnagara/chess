package chess.webapp

import org.scalajs.jquery.jQuery

import utest._

object ChessTest extends TestSuite {

  // Initialize App
  ChessApp.setupUI()

  def tests = TestSuite {
    'HelloWorld {
      assert(jQuery("h1:contains('Chess')").length == 1)
    }
  }
}
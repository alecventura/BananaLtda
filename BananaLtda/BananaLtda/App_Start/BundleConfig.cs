using System.Web;
using System.Web.Optimization;

namespace BananaLtda
{
    public class BundleConfig
    {

        public static void RegisterBundles(BundleCollection bundles)
        {
            // Scripts que vão ser incluidos em todas as paginas (eles são incluidos no _Layout.cshtml)
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/default.css",
                      "~/Content/default.date.css",
                      "~/Content/default.time.css",
                      "~/Content/toastr.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                      "~/Scripts/knockout-3.3.0.debug.js", "~/Scripts/knockout.mapping-latest.debug.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockoutCustomBindings").Include(
                      "~/Scripts/knockout-withComponent.js",
                      "~/Scripts/knockout-bindings-allowBindings.js",
                      "~/Scripts/knockout-bindings-modal.js",
                      "~/Scripts/knockout-bindings-pickadate.js",
                      "~/Scripts/knockout-bindings-pickatime.js",
                      "~/Scripts/knockout-bindings-stopBinding.js",
                      "~/Scripts/knockout-bindings-toggle.js"));

            bundles.Add(new ScriptBundle("~/bundles/underscore").Include(
                      "~/Scripts/underscore.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/pickadate").Include(
                      "~/Scripts/legacy.js",
                      "~/Scripts/picker.js",
                      "~/Scripts/picker.date.js",
                      "~/Scripts/picker.time.js"));

            bundles.Add(new ScriptBundle("~/bundles/toastr").Include(
                      "~/Scripts/toastr.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                      "~/Scripts/moment.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootbox").Include(
                      "~/Scripts/bootbox.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                      "~/Scripts/utils.js",
                      "~/Scripts/paginator.js"));

            // Scripts especificos de cada pagina:

            bundles.Add(new ScriptBundle("~/bundles/book").Include(
                      "~/View/Home/book.js"));
        }
    }
}

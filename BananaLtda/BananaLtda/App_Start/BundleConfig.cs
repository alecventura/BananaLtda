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
                        "~/Scripts/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate/jquery.validate*"));

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
                      "~/Content/bootstrap-datetimepicker.css",
                      "~/Content/fullcalendar.min.css",
                      "~/Content/toastr.min.css"));

            bundles.Add(new StyleBundle("~/Content/print").Include(
                      "~/Content/fullcalendar.print.css"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                      "~/Scripts/knockout-3.3.0.debug.js", "~/Scripts/knockout.mapping-latest.debug.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockoutCustomBindings").Include(
                      "~/Scripts/knockoutCustomBindings/knockout-withComponent.js",
                      "~/Scripts/knockoutCustomBindings/knockout-bindings-allowBindings.js",
                      "~/Scripts/knockoutCustomBindings/knockout-bindings-modal.js",
                      "~/Scripts/knockoutCustomBindings/knockout-bindings-pickadate.js",
                      "~/Scripts/knockoutCustomBindings/knockout-bindings-pickatime.js",
                      "~/Scripts/knockoutCustomBindings/knockout-bindings-stopBinding.js",
                      "~/Scripts/knockoutCustomBindings/knockout-bindings-toggle.js"));

            bundles.Add(new ScriptBundle("~/bundles/underscore").Include(
                      "~/Scripts/utils/underscore.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/pickadate").Include(
                      "~/Scripts/utils/legacy.js",
                      "~/Scripts/utils/picker.js",
                      "~/Scripts/utils/picker.date.js",
                      "~/Scripts/utils/picker.time.js"));

            bundles.Add(new ScriptBundle("~/bundles/toastr").Include(
                      "~/Scripts/utils/toastr.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                      "~/Scripts/utils/moment.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootbox").Include(
                      "~/Scripts/utils/bootbox.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/datetimepicker").Include(
                      "~/Scripts/utils/bootstrap-datetimepicker.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                      "~/Scripts/utils/utils.js",
                      "~/Scripts/utils/paginator.js"));

            bundles.Add(new ScriptBundle("~/bundles/fullcalendar").Include(
                      "~/Scripts/utils/fullcalendar.min.js"));

        }
    }

    public class BundlesFormats
    {
        public const string PRINT = @"<link href=""{0}"" rel=""stylesheet"" type=""text/css"" media=""print"" />";
    }
}

import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Code, FeatureUpsell, Link } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import AnimateHeight from "react-animate-height";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormLayout,
	OpenGraphDisabledAlert,
} from "../components";
import { withFormikDummyField } from "../hocs";
import { useSelectSettings } from "../hooks";

const FormikReplacementVariableEditorFieldWithDummy = withFormikDummyField( FormikReplacementVariableEditorField );

/**
 * Presents the `post_format` taxonomy.
 *
 * Mostly a copy from the taxonomy template, differences:
 * - disable toggle at the top, that shows/hides the rest
 * - removed the other exceptions
 *
 * @returns {JSX.Element} The formats element.
 */
const Formats = () => {
	const { name, label, singularLabel } = useSelectSettings( "selectTaxonomy", [], "post_format" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const socialAppearancePremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/4e0" );
	const exampleUrl = useSelectSettings( "selectExampleUrl", [], "/format/example/" );

	const recommendedSize = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening strong tag.
			 * %2$s expands to a closing strong tag.
			 * %3$s expands to the recommended image size.
			 */
			__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
			"<strong>",
			"</strong>",
			"1200x675px"
		),
		{
			strong: <strong className="yst-font-semibold" />,
		}
	), [] );
	const description = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
			__( "(e.g., %1$s", "wordpress-seo" ),
			"<exampleUrl />"
		),
		{
			exampleUrl: <Code>{ exampleUrl }</Code>,
		}
	) );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;
	const { "disable-post_format": disablePostFormat } = values.wpseo_titles;

	return (
		<FormLayout
			title={ <div className="yst-flex yst-items-center yst-gap-1.5">{ label }</div> }
			description={ description }
		>
			<div className="yst-max-w-5xl">
				<fieldset className="yst-min-width-0 yst-space-y-8">
					<FormikFlippedToggleField
						name="wpseo_titles.disable-post_format"
						data-id="input-wpseo_titles-disable-post_format"
						label={ __( "Format-based archives", "wordpress-seo" ) }
						description={ __( "Format-based archives can cause duplicate content issues. For most sites, we recommend that you disable this setting.", "wordpress-seo" ) }
					/>
				</fieldset>
				<hr className="yst-my-8" />
				<div className="yst-relative">
					<AnimateHeight
						easing="ease-in-out"
						duration={ 300 }
						height={ disablePostFormat ? 0 : "auto" }
						animateOpacity={ true }
					>
						<FieldsetLayout
							title={ __( "Search appearance", "wordpress-seo" ) }
							description={ sprintf(
								// translators: %1$s expands to the taxonomy plural, e.g. Tags. %2$s expands to the taxonomy singular, e.g. Tag.
								__( "Choose how your %1$s should look in search engines. You can always customize this per individual %2$s.", "wordpress-seo" ),
								label,
								singularLabel
							) }
						>
							<FormikFlippedToggleField
								name={ `wpseo_titles.noindex-tax-${ name }` }
								data-id={ `input-wpseo_titles-noindex-tax-${ name }` }
								label={ sprintf(
									// translators: %1$s expands to the taxonomy plural, e.g. Categories.
									__( "Show %1$s in search results", "wordpress-seo" ),
									label
								) }
								description={ <>
									{ sprintf(
										// translators: %1$s expands to the taxonomy plural, e.g. Categories.
										__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps. We recommend that you disable this setting.", "wordpress-seo" ),
										label
									) }
									<br />
									<Link href={ noIndexInfoLink } target="_blank" rel="noreferrer">
										{ __( "Read more about the search results settings", "wordpress-seo" ) }
									</Link>
									.
								</> }
							/>
							<FormikReplacementVariableEditorField
								type="title"
								name={ `wpseo_titles.title-tax-${ name }` }
								fieldId={ `input-wpseo_titles-title-tax-${ name }` }
								label={ __( "SEO title", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
							/>
							<FormikReplacementVariableEditorField
								type="description"
								name={ `wpseo_titles.metadesc-tax-${ name }` }
								fieldId={ `input-wpseo_titles-metadesc-tax-${ name }` }
								label={ __( "Meta description", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								className="yst-replacevar--description"
							/>
						</FieldsetLayout>
						<hr className="yst-my-8" />
						<FieldsetLayout
							title={ <div className="yst-flex yst-items-center yst-gap-1.5">
								<span>{ __( "Social appearance", "wordpress-seo" ) }</span>
								{ isPremium && <Badge variant="upsell">Premium</Badge> }
							</div> }
							description={ sprintf(
								// translators: %1$s expands to the taxonomy plural, e.g. Tags. %2$s expands to the taxonomy singular, e.g. Tag.
								__( "Choose how your %1$s should look on social media by default. You can always customize this per individual %2$s.", "wordpress-seo" ),
								label,
								singularLabel
							) }
						>
							<FeatureUpsell
								shouldUpsell={ ! isPremium }
								variant="card"
								cardLink={ socialAppearancePremiumLink }
								cardText={ sprintf(
									/* translators: %1$s expands to Premium. */
									__( "Unlock with %1$s", "wordpress-seo" ),
									"Premium"
								) }
							>
								<OpenGraphDisabledAlert isEnabled={ ! isPremium || opengraph } />
								<FormikMediaSelectField
									id={ `wpseo_titles-social-image-tax-${ name }` }
									label={ __( "Social image", "wordpress-seo" ) }
									previewLabel={ recommendedSize }
									mediaUrlName={ `wpseo_titles.social-image-url-tax-${ name }` }
									mediaIdName={ `wpseo_titles.social-image-id-tax-${ name }` }
									disabled={ ! opengraph }
									isDummy={ ! isPremium }
								/>
								<FormikReplacementVariableEditorFieldWithDummy
									type="title"
									name={ `wpseo_titles.social-title-tax-${ name }` }
									fieldId={ `input-wpseo_titles-social-title-tax-${ name }` }
									label={ __( "Social title", "wordpress-seo" ) }
									replacementVariables={ replacementVariables }
									recommendedReplacementVariables={ recommendedReplacementVariables }
									isDisabled={ ! opengraph }
									isDummy={ ! isPremium }
								/>
								<FormikReplacementVariableEditorFieldWithDummy
									type="description"
									name={ `wpseo_titles.social-description-tax-${ name }` }
									fieldId={ `input-wpseo_titles-social-description-tax-${ name }` }
									label={ __( "Social description", "wordpress-seo" ) }
									replacementVariables={ replacementVariables }
									recommendedReplacementVariables={ recommendedReplacementVariables }
									className="yst-replacevar--description"
									isDisabled={ ! opengraph }
									isDummy={ ! isPremium }
								/>
							</FeatureUpsell>
						</FieldsetLayout>
					</AnimateHeight>
				</div>
			</div>
		</FormLayout>
	);
};

export default Formats;

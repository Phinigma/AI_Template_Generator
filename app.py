from flask import Flask, render_template, request, jsonify
import os
import json
from jinja2 import Template

app = Flask(__name__)

# Load configuration data
def load_config():
    config_path = os.path.join(app.root_path, 'config', 'prompt_config.json')
    with open(config_path, 'r') as f:
        return json.load(f)

# New route to serve the configuration data as JSON
@app.route('/get_prompt_config')
def get_prompt_config():
    config = load_config()
    return jsonify(config)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        work_type = request.form.get('work_type')
        prompt_name = request.form.get('prompt_name', 'Untitled')

        # Store user inputs
        user_inputs = {'prompt_name': prompt_name, 'work_type': work_type}

        if work_type == 'Fiction':
            # Collect and process fiction-specific data
            genre = request.form.get('genre')
            subgenres = request.form.getlist('subgenres[]')  # Collect all selected subgenres
            narrative_perspective = request.form.get('narrative_perspective')
            themes = request.form.getlist('themes[]')  # Collect all selected themes
            tone = request.form.get('tone')
            writing_style = request.form.get('writing_style')
            setting = request.form.get('setting')
            characters = request.form.get('characters')
            plot_overview = request.form.get('plot_overview')
            length = request.form.get('length')
            additional_notes = request.form.get('additional_notes')

            user_inputs.update({
                'genre': genre,
                'subgenres': subgenres,
                'narrative_perspective': narrative_perspective,
                'themes': themes,
                'tone': tone,
                'writing_style': writing_style,
                'setting': setting,
                'characters': characters,
                'plot_overview': plot_overview,
                'length': length,
                'additional_notes': additional_notes
            })

        elif work_type == 'Non-Fiction':
            # Collect and process non-fiction-specific data
            genre = request.form.get('genre_nonfiction')
            purpose = request.form.get('purpose')
            audience = request.form.getlist('audience[]')  # Collect all selected audiences
            tone = request.form.get('tone_nonfiction')
            writing_style = request.form.get('writing_style_nonfiction')
            length = request.form.get('length_nonfiction')
            subject_matter = request.form.get('subject_matter')
            additional_notes = request.form.get('additional_notes_nonfiction')

            user_inputs.update({
                'genre': genre,
                'purpose': purpose,
                'audience': audience,
                'tone': tone,
                'writing_style': writing_style,
                'length': length,
                'subject_matter': subject_matter,
                'additional_notes': additional_notes
            })

        # Generate the final prompt
        final_prompt = generate_prompt(work_type, user_inputs)
        return render_template('result.html', final_prompt=final_prompt, user_inputs=user_inputs)

    else:
        # For GET request, simply render the index page
        return render_template('index.html')

def generate_prompt(work_type, inputs):
    """
    Generates a prompt based on the work type and user inputs using external template files.
    """
    # Determine the template file based on work type
    if work_type == 'Fiction':
        template_file = os.path.join(app.root_path, 'prompts', 'fiction_prompt_template.txt')
    elif work_type == 'Non-Fiction':
        template_file = os.path.join(app.root_path, 'prompts', 'nonfiction_prompt_template.txt')
    else:
        return "Invalid work type selected."

    # Read the template file
    with open(template_file, 'r') as file:
        template_content = file.read()

    # Create a Template object
    template = Template(template_content)

    # Render the template with user inputs
    prompt = template.render(**inputs)

    return prompt.strip()

if __name__ == '__main__':
    app.run(debug=True)
